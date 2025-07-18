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
  action: 'startDancing' | 'stopDancing' | 'push';
  payload?: any;
}

const playerRoomMap = new Map<string, string>();

export default (io: Server): void => {
  const roomManager = getRoomManager(io);

  const handleConnection = (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('createRoom', ({ username }: CreateRoomData) => {
      const player = new Player(socket.id, username);
      const room = roomManager.createRoom(player);
      socket.join(room.roomId);
      playerRoomMap.set(socket.id, room.roomId);
      socket.emit('roomCreated', room.getState());
    });

    socket.on('joinRoom', ({ roomId, username }: JoinRoomData) => {
      try {
        const player = new Player(socket.id, username);
        const room = roomManager.joinRoom(roomId, player);
        socket.join(roomId);
        playerRoomMap.set(socket.id, roomId);
        socket.emit('joinedRoom', room.getState());
        io.to(roomId).emit('playerJoined', room.getState());
      } catch (error: any) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('playerAction', (data: PlayerActionData) => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.game) {
          room.game.handlePlayerAction(socket.id, data.action, data.payload);
        }
      }
    });

    socket.on('startGame', () => {
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room && room.hostId === socket.id && !room.game) {
          room.startGame(io);
          io.to(roomId).emit('gameStarted', room.getState());
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

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      const roomId = playerRoomMap.get(socket.id);
      if (roomId) {
        roomManager.leaveRoom(roomId, socket.id);
        playerRoomMap.delete(socket.id);
        io.to(roomId).emit('playerLeft', { socketId: socket.id });
      }
    });
  };

  io.on('connection', handleConnection);
};