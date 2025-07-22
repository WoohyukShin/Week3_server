import { Server, Socket } from 'socket.io';
import Player from '../games/player';
import getRoomManager from '../games/RoomManager';

interface CreateRoomData {
  username: string;
}

interface JoinRoomData {
  roomId: string;
  username: string;
}

interface PlayerActionData {
  action: 'startDancing' | 'stopDancing' | 'move' | 'push';
  payload?: any;
}

const playerRoomMap = new Map<string, string>();

export default (io: Server): void => {
  const roomManager = getRoomManager(io);

  const handleConnection = (socket: Socket) => {
    console.log(`🔌 New client connected: ${socket.id} - ${new Date().toISOString()}`);

    socket.on('createRoom', ({ username }: CreateRoomData) => {
      console.log(`🏠 Socket ${socket.id} creating room for user: ${username}`);
      const player = new Player(socket.id, username);
      const room = roomManager.createRoom(player);
      socket.join(room.roomId);
      playerRoomMap.set(socket.id, room.roomId);
      socket.emit('roomCreated', room.getState());
      console.log(`✅ Room created: ${room.roomId} by ${username}`);
    });

    socket.on('joinRoom', ({ roomId, username }: JoinRoomData) => {
      console.log(`🚪 Socket ${socket.id} joining room: ${roomId} as ${username}`);
      try {
        const player = new Player(socket.id, username);
        const room = roomManager.joinRoom(roomId, player);
        socket.join(roomId);
        playerRoomMap.set(socket.id, roomId);
        socket.emit('joinedRoom', room.getState());
        io.to(roomId).emit('playerJoined', room.getState());
        console.log(`✅ ${username} joined room: ${roomId}`);
      } catch (error: any) {
        console.log(`❌ Failed to join room: ${error.message}`);
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('getRoomList', () => {
      const rooms = roomManager.getRoomList();
      socket.emit('roomList', rooms);
    });

    socket.on('playerAction', (data: PlayerActionData) => {
      console.log(`🎮 Socket ${socket.id} action: ${data.action}`, data.payload || '');
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          room.game.handlePlayerAction(socket.id, data.action, data.payload);
          // Dancing 사운드 브로드캐스트
          if (data.action === 'startDancing') {
            io.to(roomId).emit('playDanceBgm', { danceType: data.payload?.danceType || 'default' });
          } else if (data.action === 'stopDancing') {
            io.to(roomId).emit('stopDanceBgm', { danceType: data.payload?.danceType || 'default' });
          }
          socket.to(roomId).emit('playerAction', {
            socketId: socket.id,
            action: data.action,
            payload: data.payload
          });
          console.log(`[DEBUG] sockethandlers.ts :📡 Action broadcasted to room: ${roomId}`);
        }
      }
    });

    socket.on('gameReady', () => {
      console.log('[DEBUG] sockethandlers.ts : got gameReady from ', socket.id);
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room) {
          if (!room.gameReadySet) room.gameReadySet = new Set();
          room.gameReadySet.add(socket.id);
          if (room.gameReadySet.size === room.players.size) {
            room.startGame(io);
            io.to(roomId).emit('gameStarted', room.getState());
            room.players.forEach(player => {
              io.to(player.socketId).emit('setLocalPlayer', player.socketId);
            });
            console.log(`[DEBUG] sockethandlers.ts : 🎮 Game started in room: ${roomId}`);
          }
        }
      }
    });

    socket.on('startGame', () => {
      console.log(`[DEBUG] sockethandlers.ts : startGame received from ${socket.id}`);
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        io.to(roomId).emit('gameStart');
      }
    });

    socket.on('getRoomState', () => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room) {
          socket.emit('roomState', room.getState());
        }
      }
    });

    socket.on('getGameState', () => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          socket.emit('setLocalPlayer', socket.id);
          socket.emit('gameStateUpdate', room.game.getGameState());
          console.log(`📊 GameState sent to ${socket.id} in room ${roomId}`);
        }
      }
    });

    socket.on('skillReady', () => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room) {
          room.setSkillReady(socket.id);
          io.to(roomId).emit('skillReadyCount', {
            ready: room.getSkillReadyCount(),
            total: room.getTotalPlayerCount(),
          });
          if (room.isAllSkillReady()) {
            io.to(roomId).emit('allSkillReady');
            if (room.game) {
              room.game.startGameLoop();
            }
          }
        }
      }
    });

    socket.on('skillUse', () => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          room.game.handleSkillUse(socket.id);
        }
      }
    });

    socket.on('animationComplete', (data: { type: string }) => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          room.game.handleAnimationComplete(socket.id, data.type);
        }
      }
    });

    socket.on('playerExitedAfterGame', () => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room) {
          if (!room.exitedPlayers) {
            room.exitedPlayers = new Set();
          }
          room.exitedPlayers.add(socket.id);
          if (room.exitedPlayers.size === room.players.size) {
            roomManager.rooms.delete(roomId);
            console.log(`[${roomId}] Room deleted after all players exited`);
          }
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id} - ${new Date().toISOString()}`);
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        roomManager.leaveRoom(roomId, socket.id);
        playerRoomMap.delete(socket.id);
        io.to(roomId).emit('playerLeft', { socketId: socket.id });
        console.log(`👋 Player left room: ${roomId}`);
      }
    });
  };

  io.on('connection', handleConnection);
};
