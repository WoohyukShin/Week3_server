"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants/constants");
const game_1 = __importDefault(require("./game"));
class Room {
    constructor(roomId, hostPlayer, roomManager) {
        this.roomId = roomId;
        this.players = new Map();
        this.hostId = hostPlayer.socketId;
        this.game = null; // 게임이 시작되면 Game 인스턴스가 할당됩니다.
        this.roomManager = roomManager;
        this.skillReadySet = new Set();
        this.addPlayer(hostPlayer);
    }
    addPlayer(player) {
        if (this.isFull()) {
            throw new Error('The room is full.');
        }
        this.players.set(player.socketId, player);
    }
    removePlayer(socketId) {
        this.players.delete(socketId);
        // 만약 호스트가 나가면, 다른 플레이어를 호스트로 지정할 수 있습니다.
        if (this.hostId === socketId && this.players.size > 0) {
            this.hostId = this.players.keys().next().value;
        }
    }
    getPlayer(socketId) {
        return this.players.get(socketId);
    }
    isFull() {
        return this.players.size >= constants_1.MAX_PLAYERS_PER_ROOM;
    }
    isEmpty() {
        return this.players.size === 0;
    }
    // 게임을 시작하는 메소드
    startGame(io) {
        if (this.game) {
            console.log(`Game already started in room ${this.roomId}`);
            return;
        }
        console.log(`Starting game in room ${this.roomId}`);
        this.game = new game_1.default(this.roomId, Array.from(this.players.values()), io, this.roomManager);
        this.game.start();
    }
    // 방의 현재 상태를 반환
    getState() {
        return {
            roomId: this.roomId,
            hostId: this.hostId,
            players: Array.from(this.players.values()).map(p => p.getInfo()),
            isGameStarted: !!this.game,
        };
    }
    // 모든 player가 스킬 설명을 읽고 OK 버튼을 눌렀는가 ?
    resetSkillReady() {
        this.skillReadySet.clear();
    }
    setSkillReady(socketId) {
        this.skillReadySet.add(socketId);
    }
    getSkillReadyCount() {
        return this.skillReadySet.size;
    }
    getTotalPlayerCount() {
        return this.players.size;
    }
    isAllSkillReady() {
        return this.skillReadySet.size === this.players.size;
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map