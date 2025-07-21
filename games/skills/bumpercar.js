// server/games/skills/bumpercar.js
const Skill = require('../Skill');

class bumpercar extends Skill {
  constructor(owner) {
    super(owner);
    this.name = '노래';
    this.description = '범퍼카 재생! 다른 사람 commit 게이지 절반으로. 1회 사용.';
    this.used = false;
  }

  execute(allPlayers) {
    if (this.used) return;
    this.owner.bumpercar = true;
    this.used = true;
    this.onUse();
    // 프런트에 bumpercar 상태 진입 알림 (애니메이션/사운드 재생)
    if (this.owner.game && this.owner.game.broadcast) {
      this.owner.game.broadcast('skillEffect', {
        type: 'bumpercar',
        socketId: this.owner.socketId,
        duration: 3000
      });
    }
    // 3초 후 효과 적용
    setTimeout(() => {
      if (this.owner.isAlive) {
        allPlayers.forEach(p => {
          if (p.socketId !== this.owner.socketId && p.isAlive) {
            p.flowGauge = Math.max(0, Math.floor(p.flowGauge * (1 - GAME_CONSTANTS.BUMPERCAR_FLOW_GAUGE_DECREASE_RATE)));
          }
        });
        this.owner.bumpercar = false;
        if (this.owner.game && this.owner.game.broadcast) {
          this.owner.game.broadcast('skillEffect', {
            type: 'bumpercarEnd',
            socketId: this.owner.socketId
          });
        }
        // 게이지 업데이트 브로드캐스트 (불필요하므로 제거)
        // if (this.owner.game && this.owner.game.broadcast) {
        //   this.owner.game.broadcast('gameStateUpdate', this.owner.game.getGameState());
        // }
      }
    }, 3000);
  }
}

module.exports = bumpercar;
