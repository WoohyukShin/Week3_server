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
class Bumpercar extends Skill_1.Skill {
    constructor(owner) {
        super(owner);
        this.name = 'bumpercar';
        this.description = '범퍼카 재생! 다른 사람 commit 게이지 절반으로. 1회 사용.';
        this.used = false;
    }
    execute(allPlayers) {
        if (this.used)
            return;
        this.owner.playerMotion = 'bumpercar';
        this.used = true;
        // SFX 재생 신호
        console.log('[DEBUG] 서버에서 playSkillSfx broadcast: bumpercar');
        this.owner.game.broadcast('playSkillSfx', { type: 'bumpercar' });
        this.onUse();
        setTimeout(() => {
            if (this.owner.isAlive) {
                allPlayers.forEach(p => {
                    if (p.socketId !== this.owner.socketId && p.isAlive) {
                        p.flowGauge = Math.max(0, Math.floor(p.flowGauge * (1 - GAME_CONSTANTS.BUMPERCAR_FLOW_GAUGE_DECREASE_RATE)));
                    }
                });
                this.owner.playerMotion = 'coding';
            }
        }, 3000);
    }
}
exports.default = Bumpercar;
//# sourceMappingURL=bumpercar.js.map