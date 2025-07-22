"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Skill_1 = require("../Skill");
class Shotgun extends Skill_1.Skill {
    constructor(owner) {
        super(owner);
        this.name = 'shotgun';
        this.description = '운영진 강제 등장. 최대 2회 사용.';
        this.cooldown = 5;
        this.usesLeft = 2;
    }
    execute(allPlayers) {
        if (this.usesLeft <= 0)
            return;
        if (this.owner.game && this.owner.game.broadcast) {
            this.owner.game.broadcast('Shotgun', {
                socketId: this.owner.socketId
            });
        }
        this.usesLeft--;
        this.onUse();
    }
}
exports.default = Shotgun;
//# sourceMappingURL=shotgun.js.map