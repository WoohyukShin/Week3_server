"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class SkillManager {
    constructor() {
        this.skills = new Map(); // Map<skillName, SkillClass>
        this.loadSkills();
    }
    loadSkills() {
        const skillsDir = path_1.default.join(__dirname, 'skills');
        if (!fs_1.default.existsSync(skillsDir)) {
            fs_1.default.mkdirSync(skillsDir);
        }
        const skillFiles = fs_1.default.readdirSync(skillsDir).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
        for (const file of skillFiles) {
            try {
                const module = require(path_1.default.join(skillsDir, file));
                // CommonJS (module.exports = X)와 ES Module (export default X) 모두 호환되도록 처리
                const SkillClass = module.default || module;
                // 파일 이름을 기반으로 스킬 이름을 생성 (예: caffeine.ts -> caffeine)
                const skillName = path_1.default.basename(file, path_1.default.extname(file));
                this.skills.set(skillName, SkillClass);
                console.log(`Loaded skill: ${skillName}`);
            }
            catch (err) {
                console.error(`Failed to load skill from ${file}:`, err);
            }
        }
        console.log('SkillManager loaded skills:', Array.from(this.skills.keys()));
    }
    /**
       플레이어에게 랜덤 스킬을 생성하여 부여합니다.
       @param {Player} player - 스킬을 받을 플레이어
       @returns {Skill|null}
     */
    assignRandomSkill(player) {
        const skillNames = Array.from(this.skills.keys());
        if (skillNames.length === 0) {
            console.warn('No skills available to assign.');
            return null;
        }
        const randomSkillName = skillNames[Math.floor(Math.random() * skillNames.length)];
        const SkillClass = this.skills.get(randomSkillName);
        if (!SkillClass) {
            console.error(`Could not find class for skill: ${randomSkillName}`);
            return null;
        }
        const skillInstance = new SkillClass(player);
        player.skill = skillInstance;
        console.log(`Assigned skill '${randomSkillName}' to player ${player.username}`);
        return skillInstance;
    }
}
const instance = new SkillManager();
exports.default = instance;
//# sourceMappingURL=SkillManager.js.map