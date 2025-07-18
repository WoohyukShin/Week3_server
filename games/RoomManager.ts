import Room from './Room';
import Player from './player';
import { Server } from 'socket.io';

export class RoomManager {
  io: Server;
  rooms: Map<string, Room>; // Map<roomId, Room>

  constructor(io: Server) {
    this.io = io;
    this.rooms = new Map();
  }

  createRoom(hostPlayer: Player): Room {
    const roomId = this.generateRoomId();
    const room = new Room(roomId, hostPlayer, this);
    this.rooms.set(roomId, room);
    console.log(`Room created: ${roomId} by ${hostPlayer.username}`);
    return room;
  }

  joinRoom(roomId: string, player: Player): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found.');
    }
    room.addPlayer(player);
    
    // 방에 있는 모든 사람에게 새로운 플레이어 정보 전파
    this.io.to(roomId).emit('playerJoined', room.getState());
    
    // 방이 꽉 찼으면 게임 시작
    if (room.isFull()) {
      room.startGame(this.io);
    }
    return room;
  }

  leaveRoom(roomId: string, socketId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.removePlayer(socketId);
      console.log(`Player ${socketId} left room ${roomId}`);
      
      if (room.isEmpty()) {
        this.rooms.delete(roomId);
        console.log(`Room destroyed: ${roomId}`);
      } else {
        // 방에 남은 사람들에게 정보 전파
        this.io.to(roomId).emit('playerLeft', room.getState());
      }
    }
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  // 간단한 랜덤 ID 생성기
  generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

// RoomManager를 싱글톤으로 만들기 위해 인스턴스를 내보냅니다.
let instance: RoomManager | null = null;

const getRoomManager = (io: Server): RoomManager => {
  if (!instance) {
    instance = new RoomManager(io);
  }
  return instance;
};

export default getRoomManager;
