"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
class Skill {
    /**
     * @param {Player} owner - 이 스킬을 소유한 플레이어
     */
    constructor(owner) {
        this.owner = owner;
        this.name = 'Unnamed Skill';
        this.description = 'No description provided.';
        this.cooldown = 0;
        this.lastUsed = 0;
    }
    /**
     * 스킬을 사용할 수 있는지 확인합니다.
     * @returns {boolean}
     */
    canUse() {
        return Date.now() - this.lastUsed > this.cooldown * 1000;
    }
    // 스킬 사용 후 호출
    onUse() {
        this.lastUsed = Date.now();
    }
}
exports.Skill = Skill;
//# sourceMappingURL=Skill.js.map