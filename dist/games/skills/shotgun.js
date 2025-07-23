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
class Shotgun extends Skill_1.Skill {
    constructor(owner, game) {
        super(owner, game);
        this.name = 'shotgun';
        this.description = '운영진 강제 등장. 최대 2회 사용.';
        this.cooldown = GAME_CONSTANTS.SHOTGUN_COOLDOWN_MS;
        this.usesLeft = 2;
    }
    execute(allPlayers) {
        if (this.isCooldown)
            return;
        if (this.usesLeft <= 0)
            return;
        this.usesLeft--;
        this.onUse();
        this.owner.playerMotion = 'shotgun';
        // SFX 재생 신호
        console.log('[DEBUG] 서버에서 playSkillSfx broadcast: shotgun');
        this.game.broadcast('playSkillSfx', { type: 'shotgun' });
    }
}
exports.default = Shotgun;
//# sourceMappingURL=shotgun.js.map