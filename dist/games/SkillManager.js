"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bumpercar_1 = __importDefault(require("./skills/bumpercar"));
const coffee_1 = __importDefault(require("./skills/coffee"));
const exercise_1 = __importDefault(require("./skills/exercise"));
const game_1 = __importDefault(require("./skills/game"));
const shotgun_1 = __importDefault(require("./skills/shotgun"));
class SkillManager {
    constructor() {
        this.skills = new Map();
        // 타입스크립트 default import로 명확하게 등록
        console.log('[SkillManager] Bumpercar import:', bumpercar_1.default);
        this.skills.set('bumpercar', bumpercar_1.default);
        this.skills.set('coffee', coffee_1.default);
        this.skills.set('exercise', exercise_1.default);
        this.skills.set('game', game_1.default);
        this.skills.set('shotgun', shotgun_1.default);
        console.log('[SkillManager] skills Map keys:', Array.from(this.skills.keys()));
        console.log('[SkillManager] skills Map bumpercar:', this.skills.get('bumpercar'));
    }
    assignRandomSkill(player) {
        const skillNames = Array.from(this.skills.keys());
        console.log('[SkillManager] assignRandomSkill skillNames:', skillNames);
        if (skillNames.length === 0) {
            console.warn('No skills available to assign.');
            return null;
        }
        const randomSkillName = skillNames[Math.floor(Math.random() * skillNames.length)];
        const SkillClass = this.skills.get(randomSkillName);
        console.log('[SkillManager] assignRandomSkill SkillClass:', SkillClass, 'for', randomSkillName);
        if (!SkillClass) {
            console.error(`Could not find class for skill: ${randomSkillName}`);
            return null;
        }
        const skillInstance = new SkillClass(player);
        player.skill = skillInstance;
        console.log(`[SkillManager] Assigned skill '${randomSkillName}' to player ${player.username}`, skillInstance);
        return skillInstance;
    }
}
const instance = new SkillManager();
exports.default = instance;
//# sourceMappingURL=SkillManager.js.map