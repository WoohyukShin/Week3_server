// server/games/skills/shotgun.js
const Skill = require('../Skill');

class shotgun extends skills {
  constructor(owner) {
    super(owner);
    this.name = '샷건';
    this.description = '운영진 강제 등장. 최대 2회 사용.';
    this.cooldown = 5;
    this.usesLeft = 2;
  }

  execute(allPlayers) {
    if (this.usesLeft <= 0) return;
    this.owner.game.broadcast('Shotgun', {
      socketId: player.socketId
    });
    this.usesLeft--;
    this.onUse();
  }
}

module.exports = shotgun;