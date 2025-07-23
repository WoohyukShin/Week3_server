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
    assignRandomSkill(player, game) {
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
        const skillInstance = new SkillClass(player, game);
        player.skill = skillInstance;
        console.log(`[SkillManager] Assigned skill '${randomSkillName}' to player ${player.username}`, skillInstance);
        return skillInstance;
    }
    assignUniqueSkills(players, game) {
        const skillNames = Array.from(this.skills.keys());
        // 1P는 무조건 bumpercar
        const result = [];
        const bumpercarIdx = skillNames.indexOf('bumpercar');
        if (bumpercarIdx !== -1) {
            const SkillClass = this.skills.get('bumpercar');
            if (SkillClass) {
                result.push(new SkillClass(players[0], game));
                skillNames.splice(bumpercarIdx, 1); // bumpercar는 제외
            }
        }
        // 나머지 스킬 셔플
        for (let i = skillNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [skillNames[i], skillNames[j]] = [skillNames[j], skillNames[i]];
        }
        // 나머지 플레이어에게 중복 없이 배정
        for (let i = 1; i < players.length; i++) {
            const skillName = skillNames[(i - 1) % skillNames.length];
            const SkillClass = this.skills.get(skillName);
            if (SkillClass) {
                result.push(new SkillClass(players[i], game));
            }
        }
        return result;
    }
}
const instance = new SkillManager();
exports.default = instance;
//# sourceMappingURL=SkillManager.js.map