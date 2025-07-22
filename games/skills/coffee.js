// server/games/skills/coffee.js
const Skill = require('../Skill');

class coffee extends Skill {
  constructor(owner) {
    super(owner);
    this.name = 'coffee'; // Shown to player
    this.description = '5초간 몰입 게이지 감소 없음';
    this.cooldown = 15;
  }

  execute() {
    this.owner.
    setTimeout(() => {
      this.owner.isFlowProtected = false;
    }, 5000);
    this.onUse();
  }
}

module.exports = coffee;
