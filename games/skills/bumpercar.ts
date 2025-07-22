import { Skill } from '../Skill';
import Player from '../player';
import Game from '../game';
import * as GAME_CONSTANTS from '../../constants/constants';

export default class Bumpercar extends Skill {
  used: boolean;
  constructor(owner: Player, game: Game) {
    super(owner, game);
    this.name = 'bumpercar';
    this.description = '범퍼카 재생! 다른 사람 commit 게이지 절반으로. 1회 사용.';
    this.used = false;
  }

  execute(allPlayers: Player[]): void {
    if (this.used) return;
    this.owner.playerMotion = 'bumpercar';
    this.used = true;
    // SFX 재생 신호
    console.log('[DEBUG] 서버에서 playSkillSfx broadcast: bumpercar');
    this.game.broadcast('playSkillSfx', { type: 'bumpercar' });
    this.onUse();
    setTimeout(() => {
      if (this.owner.isAlive) {
        allPlayers.forEach(p => {
          if (p.socketId !== this.owner.socketId && p.isAlive) {
            p.flowGauge = Math.max(0, Math.floor(p.flowGauge * (1 - GAME_CONSTANTS.BUMPERCAR_FLOW_GAUGE_DECREASE_RATE)));
          }
        });
        this.owner.playerMotion = 'coding';
      }
    }, 3000);
  }
} 