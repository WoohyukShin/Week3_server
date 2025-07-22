import { Skill } from '../Skill';
import Player from '../player';
import * as GAME_CONSTANTS from '../../constants/constants';

export default class Bumpercar extends Skill {
  used: boolean;
  constructor(owner: Player) {
    super(owner);
    this.name = 'bumpercar';
    this.description = '범퍼카 재생! 다른 사람 commit 게이지 절반으로. 1회 사용.';
    this.used = false;
  }

  execute(allPlayers: Player[]): void {
    if (this.used) return;
    this.owner.bumpercar = true;
    this.used = true;
    this.onUse();
    if (this.owner.game && this.owner.game.broadcast) {
      this.owner.game.broadcast('skillEffect', {
        type: 'bumpercar',
        socketId: this.owner.socketId,
        duration: 3000
      });
    }
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
      }
    }, 3000);
  }
} 