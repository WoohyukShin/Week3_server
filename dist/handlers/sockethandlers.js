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
                    // 다른 플레이어들에게 액션 전파
                    socket.to(roomId).emit('playerAction', {
                        socketId: socket.id,
                        action: data.action,
                        payload: data.payload
                    });
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
                    // 게임 시작 시 모든 플레이어에게 로컬 플레이어 ID 설정
                    room.players.forEach(player => {
                        io.to(player.socketId).emit('setLocalPlayer', player.socketId);
                    });
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