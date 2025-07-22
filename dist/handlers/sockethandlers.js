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
        console.log(`🔌 New client connected: ${socket.id} - ${new Date().toISOString()}`);
        socket.on('createRoom', ({ username }) => {
            console.log(`🏠 Socket ${socket.id} creating room for user: ${username}`);
            const player = new player_1.default(socket.id, username);
            const room = roomManager.createRoom(player);
            socket.join(room.roomId);
            playerRoomMap.set(socket.id, room.roomId);
            socket.emit('roomCreated', room.getState());
            console.log(`✅ Room created: ${room.roomId} by ${username}`);
        });
        socket.on('joinRoom', ({ roomId, username }) => {
            console.log(`🚪 Socket ${socket.id} joining room: ${roomId} as ${username}`);
            try {
                const player = new player_1.default(socket.id, username);
                const room = roomManager.joinRoom(roomId, player);
                socket.join(roomId);
                playerRoomMap.set(socket.id, roomId);
                socket.emit('joinedRoom', room.getState());
                io.to(roomId).emit('playerJoined', room.getState());
                console.log(`✅ ${username} joined room: ${roomId}`);
            }
            catch (error) {
                console.log(`❌ Failed to join room: ${error.message}`);
                socket.emit('error', { message: error.message });
            }
        });
        socket.on('getRoomList', () => {
            const rooms = roomManager.getRoomList(); // roomId, roomName, host 포함한 배열
            socket.emit('roomList', rooms);
        });
        socket.on('playerAction', (data) => {
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
        // 모든 플레이어가 게임 페이지에 진입해 준비가 되었음을 알림
        socket.on('gameReady', () => {
            const roomId = playerRoomMap.get(socket.id);
            if (roomId) {
                const room = roomManager.getRoom(roomId);
                if (room) {
                    if (!room.gameReadySet)
                        room.gameReadySet = new Set();
                    room.gameReadySet.add(socket.id);
                    if (room.gameReadySet.size === room.players.size) {
                        // 모든 플레이어가 준비됨 → 진짜 게임 시작
                        room.startGame(io);
                        io.to(roomId).emit('gameStarted', room.getState());
                        room.players.forEach(player => {
                            io.to(player.socketId).emit('setLocalPlayer', player.socketId);
                        });
                        console.log(`🎮 Game started in room: ${roomId}`);
                    }
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
                    socket.emit('setLocalPlayer', socket.id);
                    socket.emit('gameStateUpdate', room.game.getGameState());
                    console.log(`📊 GameState sent to ${socket.id} in room ${roomId}`);
                }
            }
        });
        // 모든 플레이어가 Skill 설명창을 읽고 OK를 누름.
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
        // 스킬 사용 이벤트
        socket.on('skillUse', () => {
            const roomId = playerRoomMap.get(socket.id);
            if (roomId) {
                const room = roomManager.getRoom(roomId);
                if (room && room.game) {
                    room.game.handleSkillUse(socket.id);
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
//# sourceMappingURL=sockethandlers.js.map