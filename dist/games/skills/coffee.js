"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Skill_1 = require("../Skill");
class Coffee extends Skill_1.Skill {
    constructor(owner) {
        super(owner);
        this.name = 'coffee';
        this.description = '5초간 몰입 게이지 감소 없음';
        this.cooldown = 15;
    }
    execute() {
        this.onUse();
        this.owner.isFlowProtected = true;
        setTimeout(() => {
            this.owner.isFlowProtected = false;
        }, 5000);
    }
}
exports.default = Coffee;
//# sourceMappingURL=coffee.js.map