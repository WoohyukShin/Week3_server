"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Skill_1 = require("../Skill");
class Exercise extends Skill_1.Skill {
    constructor(owner) {
        super(owner);
        this.name = 'exercise';
        this.description = '운동을 시작함. 3초 동안 운동에 성공하면 근육량이 오름. 근육량이 꽉 차면 게임을 승리함.';
        this.cooldown = 3;
    }
    execute() {
        this.onUse();
        this.owner.isExercising = true;
    }
}
exports.default = Exercise;
//# sourceMappingURL=exercise.js.map