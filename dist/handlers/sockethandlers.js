"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("../games/player"));
const RoomManager_1 = __importDefault(require("../games/RoomManager"));
const playerRoomMap = new Map();
exports.default = (io) => {
    const roomManager = (0, RoomManager_1.default)(io);
    const handleConnection = (socket) => {
        console.log(`New client connected: ${socket.id}`);
        socket.on('createRoom', ({ username }) => {
            const player = new player_1.default(socket.id, username);
            const room = roomManager.createRoom(player);
            socket.join(room.roomId);
            playerRoomMap.set(socket.id, room.roomId);
            socket.emit('roomCreated', room.getState());
        });
        socket.on('joinRoom', ({ roomId, username }) => {
            try {
                const player = new player_1.default(socket.id, username);
                const room = roomManager.joinRoom(roomId, player);
                socket.join(roomId);
                playerRoomMap.set(socket.id, roomId);
                socket.emit('joinedRoom', room.getState());
                io.to(roomId).emit('playerJoined', room.getState());
            }
            catch (error) {
                socket.emit('error', { message: error.message });
            }
        });
        socket.on('playerAction', (data) => {
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
//# sourceMappingURL=sockethandlers.js.map