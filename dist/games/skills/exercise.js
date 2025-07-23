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
const Skill_1 = require("../Skill");
const GAME_CONSTANTS = __importStar(require("../../constants/constants"));
class Exercise extends Skill_1.Skill {
    constructor(owner, game) {
        super(owner, game);
        this.name = 'exercise';
        this.description = '운동을 시작함. 3초 동안 운동에 성공하면 근육량이 오름. 근육량이 꽉 차면 게임을 승리함.';
        this.cooldown = GAME_CONSTANTS.EXERCISE_COOLDOWN_MS;
    }
    execute() {
        if (this.isCooldown)
            return;
        this.onUse();
        this.owner.playerMotion = 'exercise';
        // SFX 재생 신호
        console.log('[DEBUG] 서버에서 playSkillSfx broadcast: exercise');
        this.game.broadcast('playSkillSfx', { type: 'exercise' });
        setTimeout(() => {
            if (this.owner.isAlive) {
                this.owner.playerMotion = 'coding';
                this.owner.muscleCount = this.owner.muscleCount + 1;
                if (this.owner.muscleCount >= GAME_CONSTANTS.MUSCLE_TO_WIN) {
                    this.owner.game.broadcast('gameEnded', {
                        winner: this.owner.socketId
                    });
                }
            }
        }, GAME_CONSTANTS.EXERCISE_TIME_MS);
    }
}
exports.default = Exercise;
//# sourceMappingURL=exercise.js.map