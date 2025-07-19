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

    socket.on('playerAction', (data: PlayerActionData) => {
      console.log(`🎮 Socket ${socket.id} action: ${data.action}`, data.payload || '');
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          room.game.handlePlayerAction(socket.id, data.action, data.payload);
          // 다른 플레이어들에게 액션 전파
          socket.to(roomId).emit('playerAction', {
            socketId: socket.id,
            action: data.action,
            payload: data.payload
          });
          console.log(`📡 Action broadcasted to room: ${roomId}`);
        }
      }
    });

    socket.on('startGame', () => {
      console.log(`🎯 Socket ${socket.id} starting game`);
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.hostId === socket.id && !room.game) {
          room.startGame(io);
          io.to(roomId).emit('gameStarted', room.getState());
          
          // 게임 시작 시 모든 플레이어에게 로컬 플레이어 ID 설정
          room.players.forEach(player => {
            io.to(player.socketId).emit('setLocalPlayer', player.socketId);
          });
          console.log(`🎮 Game started in room: ${roomId}`);
        }
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
          socket.emit('gameStateUpdate', room.game.getGameState());
        }
      }
    });

    // 게임 관련 이벤트들
    socket.on('gameStateUpdate', () => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          io.to(roomId).emit('gameStateUpdate', room.game.getGameState());
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