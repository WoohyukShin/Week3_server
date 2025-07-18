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
Object.defineProperty(exports, "__esModule", { value: true });
const GAME_CONSTANTS = __importStar(require("../constants/constants"));
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
        this.broadcast('gameStarted', this.getGameState());
        this.gameInterval = setInterval(() => this.tick(), GAME_CONSTANTS.GAME_TICK_INTERVAL);
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
    handleManagerEvent() {
        if (Math.random() < GAME_CONSTANTS.MANAGER_APPEARANCE_PROBABILITY && !this.isManagerAppeared) {
            this.isManagerAppeared = true;
            this.broadcast('managerAppeared', {});
            setTimeout(() => {
                this.killPlayers();
            }, GAME_CONSTANTS.MANAGER_KILL_DELAY_MS);
        }
        else {
            this.isManagerAppeared = false;
        }
    }
    killPlayers() {
        this.players.forEach(player => {
            if (player.isDancing) {
                player.isAlive = false;
                this.broadcast('playerDied', { socketId: player.socketId, reason: 'dancing' });
            }
        });
        this.isManagerAppeared = false;
    }
    updatePlayerGauges(player) {
        if (player.isDancing) {
            player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge + GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK);
        }
        else {
            player.flowGauge = Math.max(0, player.flowGauge - GAME_CONSTANTS.FLOW_GAUGE_DECREASE_PER_TICK);
            let commitIncrease = GAME_CONSTANTS.COMMIT_GAUGE_PER_TICK;
            if (player.flowGauge < GAME_CONSTANTS.FLOW_GAUGE_PENALTY_THRESHOLD) {
                commitIncrease /= 2;
            }
            player.commitGauge += commitIncrease;
            if (player.commitGauge >= GAME_CONSTANTS.MAX_COMMIT_GAUGE) {
                player.commitGauge = 0;
                player.commitCount++;
                this.broadcast('commitSuccess', { socketId: player.socketId, commitCount: player.commitCount });
            }
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
        if (alivePlayers.length <= 1) {
            this.endGame(alivePlayers.length === 1 ? alivePlayers[0] : null);
        }
    }
    endGame(winner) {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.broadcast('gameEnded', { winner: winner ? winner.getInfo() : null });
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
                player.isDancing = true;
                break;
            case 'stopDancing':
                player.isDancing = false;
                break;
            case 'push':
                this.broadcast('pushStarted', { socketId: player.socketId });
                setTimeout(() => {
                    this.handlePush(player);
                }, GAME_CONSTANTS.PUSH_ANIMATION_DURATION_MS);
                break;
        }
    }
    handlePush(player) {
        const successRate = player.commitCount * GAME_CONSTANTS.PUSH_SUCCESS_BASE_RATE;
        if (Math.random() < successRate) {
            this.endGame(player);
        }
        else {
            player.commitCount = 0;
            this.broadcast('pushFailed', { socketId: player.socketId });
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