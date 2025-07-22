"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Skill_1 = require("../Skill");
class GameSkill extends Skill_1.Skill {
    constructor(owner) {
        super(owner);
        this.name = 'game';
        this.description = '미연시 플레이로 몰입 증가. 운영진 있어도 안전. 최대 3회.';
        this.cooldown = 10;
        this.usesLeft = 3;
    }
    execute() {
        if (this.usesLeft <= 0)
            return;
        this.owner.playingGame = true;
        setTimeout(() => {
            this.owner.playingGame = false;
        }, 2000);
        this.usesLeft--;
        this.onUse();
    }
}
exports.default = GameSkill;
//# sourceMappingURL=game.js.map