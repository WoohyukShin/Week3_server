"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 각 스킬 클래스 import (CommonJS require 사용)
const Bumpercar = require('./skills/bumpercar');
const Coffee = require('./skills/coffee');
const Exercise = require('./skills/exercise');
const Game = require('./skills/game');
const Shotgun = require('./skills/shotgun');
class SkillManager {
    constructor() {
        this.skills = new Map();
        // 수동 매핑: 스킬 이름과 클래스 직접 등록
        this.skills.set('bumpercar', Bumpercar);
        this.skills.set('coffee', Coffee);
        this.skills.set('exercise', Exercise);
        this.skills.set('game', Game);
        this.skills.set('shotgun', Shotgun);
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