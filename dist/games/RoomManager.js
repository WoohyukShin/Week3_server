"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const Room_1 = __importDefault(require("./Room"));
class RoomManager {
    constructor(io) {
        this.io = io;
        this.rooms = new Map();
    }
    createRoom(hostPlayer) {
        const roomId = this.generateRoomId();
        const room = new Room_1.default(roomId, hostPlayer, this);
        this.rooms.set(roomId, room);
        console.log(`Room created: ${roomId} by ${hostPlayer.username}`);
        this.broadcastRoomList();
        return room;
    }
    broadcastRoomList() {
        const roomList = Array.from(this.rooms.entries()).map(([roomId, room]) => ({
            roomId,
            roomName: room.getState().players[0]?.username || '이름 없음',
            host: room.getState().hostId,
        }));
        this.io.emit('roomList', roomList); // 모든 클라이언트에 전송
    }
    joinRoom(roomId, player) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new Error('Room not found.');
        }
        room.addPlayer(player);
        // 방에 있는 모든 사람에게 새로운 플레이어 정보 전파
        this.io.to(roomId).emit('playerJoined', room.getState());
        return room;
    }
    leaveRoom(roomId, socketId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.removePlayer(socketId);
            console.log(`Player ${socketId} left room ${roomId}`);
            if (room.isEmpty()) {
                this.rooms.delete(roomId);
                console.log(`Room destroyed: ${roomId}`);
            }
            else {
                // 방에 남은 사람들에게 정보 전파
                this.io.to(roomId).emit('playerLeft', room.getState());
            }
        }
        this.broadcastRoomList();
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    getRoomList() {
        return Array.from(this.rooms.entries()).map(([roomId, room]) => ({
            roomId,
            roomName: room.getState().players[0]?.username || '이름 없음',
            host: room.getState().hostId,
        }));
    }
    // 간단한 랜덤 ID 생성기
    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}
exports.RoomManager = RoomManager;
let instance = null;
const getRoomManager = (io) => {
    if (!instance) {
        instance = new RoomManager(io);
    }
    return instance;
};
exports.default = getRoomManager;
//# sourceMappingURL=RoomManager.js.map