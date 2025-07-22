"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GAME_CONSTANTS = __importStar(require("../constants/constants"));
const SkillManager_1 = __importDefault(require("./SkillManager"));
class Game {
    constructor(roomId, players, io, roomManager) {
        this.roomId = roomId;
        this.players = players;
        this.io = io;
        this.roomManager = roomManager;
        this.gameInterval = null;
        this.isManagerAppeared = false;
    }
    start() {
        console.log(`🎮 Game.start() called for room: ${this.roomId}`);
        this.players.forEach(player => {
            // 랜덤 스킬 할당
            const skillInstance = SkillManager_1.default.assignRandomSkill(player);
            player.skill = skillInstance;
            this.io.to(player.socketId).emit('skillAssigned', { skill: player.skill ? player.skill.name : null });
            console.log(`[Game.start] skillAssigned sent to ${player.username} (${player.socketId}):`, player.skill ? player.skill.name : null);
        });
        const room = this.roomManager.getRoom(this.roomId);
        if (room)
            room.resetSkillReady();
        this.broadcast('gameStarted', this.getGameState());
    }
    startGameLoop() {
        this.gameInterval = setInterval(() => this.tick(), GAME_CONSTANTS.GAME_TICK_INTERVAL);
        console.log(`⏰ Game interval started for room: ${this.roomId}`);
    }
    tick() {
        this.handleManagerEvent();
        this.players.forEach(player => {
            if (!player.isAlive)
                return;
            this.updatePlayerGauges(player);
            this.checkPlayerStatus(player);
        });
        this.broadcast('gameStateUpdate', this.getGameState());
        this.checkEndCondition();
    }
    handleManagerEvent(forceAppear = false) {
        const randomValue = Math.random();
        var shouldAppear = randomValue < GAME_CONSTANTS.MANAGER_APPEARANCE_PROBABILITY;
        if (forceAppear) {
            shouldAppear = true;
            return;
        }
        if (shouldAppear && !this.isManagerAppeared) {
            this.isManagerAppeared = true;
            this.broadcast('managerAppeared', {});
            setTimeout(() => this.killPlayers(), GAME_CONSTANTS.MANAGER_KILL_DELAY_MS);
        }
    }
    killPlayers() {
        this.players.forEach(player => {
            if (player.playerMotion == 'dancing' || player.playerMotion == 'exercise' || player.playerMotion == 'bumpercar') {
                player.isAlive = false;
                this.broadcast('playerDied', { socketId: player.socketId, reason: 'Manager' });
            }
        });
        this.isManagerAppeared = false;
    }
    updatePlayerGauges(player) {
        if (player.playerMotion === 'dancing') { // dancing일 때 몰입 게이지 증가
            player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge +
                GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK);
        }
        else if (player.playerMotion === 'gaming') { // gaming일 때 몰입 게이지 덜 증가
            player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge +
                GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK * GAME_CONSTANTS.GAME_FLOW_GAUGE_RATE);
        }
        else if (player.isFlowProtedted || player.playerMotion !== 'coding') {
            return; // 커피 버프 중 or 운동, 노래 부를 때는 몰입 게이지 변화 없음
        }
        else {
            player.flowGauge = Math.max(0, player.flowGauge - GAME_CONSTANTS.FLOW_GAUGE_DECREASE_PER_TICK);
        }
    }
    checkPlayerStatus(player) {
        if (player.flowGauge <= 0) {
            player.isAlive = false;
            this.broadcast('playerDied', { socketId: player.socketId, reason: 'flow' });
        }
    }
    checkEndCondition() {
        const alivePlayers = this.players.filter(p => p.isAlive);
        if (alivePlayers.length <= 1)
            this.endGame(alivePlayers[0] || null);
    }
    endGame(winner) {
        if (this.gameInterval)
            clearInterval(this.gameInterval);
        const endTime = Date.now();
        const room = this.roomManager.getRoom(this.roomId);
        const totalTimeMs = endTime - (room?.startTime ?? endTime);
        const formattedTime = `${Math.floor(totalTimeMs / 60000).toString().padStart(2, '0')}:${Math.floor((totalTimeMs % 60000) / 1000).toString().padStart(2, '0')}`;
        this.players.forEach((player) => {
            const resultData = {
                winnerSocketId: winner?.socketId ?? '',
                skill: player.skill?.name || '',
                time: formattedTime,
            };
            this.io.to(player.socketId).emit('gameEnded', resultData);
            console.log(`[Game.endGame] Sent gameEnded to ${player.username}`, resultData);
        });
        if (this.roomManager) {
            this.roomManager.rooms.delete(this.roomId);
            console.log(`[${this.roomId}] Room deleted after game ended`);
        }
    }
    handlePlayerAction(socketId, action, data) {
        const player = this.players.find(p => p.socketId === socketId);
        if (!player || !player.isAlive)
            return;
        switch (action) {
            case 'startDancing':
                player.playerMotion = 'dancing';
                break;
            case 'stopDancing':
                player.playerMotion = 'coding';
                break;
            // push 관련 case 삭제
        }
    }
    /*
    handlePush(player: Player): void {
      const successRate = player.commitCount * GAME_CONSTANTS.PUSH_SUCCESS_BASE_RATE;
      if (Math.random() < successRate) {
        this.endGame(player);
      } else {
        player.commitCount = 0;
        this.broadcast('pushFailed', { socketId: player.socketId });
      }
    }
  */
    handleSkillUse(socketId) {
        const player = this.players.find(p => p.socketId === socketId);
        if (player && player.skill) {
            player.skill.execute(this.players);
        }
    }
    // animationComplete 이벤트 처리
    handleAnimationComplete(socketId, type) {
        const player = this.players.find(p => p.socketId === socketId);
        if (!player)
            return;
        if (type === 'coffee') {
            player.playerMotion = 'coding';
        }
        else if (type === 'shotgun') {
            player.playerMotion = 'coding';
            this.isManagerAppeared = true;
            this.broadcast('managerAppeared', {});
        }
    }
    broadcast(event, data) {
        this.io.to(this.roomId).emit(event, data);
    }
    getGameState() {
        return {
            roomId: this.roomId,
            players: this.players.map(p => p.getInfo()),
            isManagerAppeared: this.isManagerAppeared,
        };
    }
}
exports.default = Game;
//# sourceMappingURL=game.js.map