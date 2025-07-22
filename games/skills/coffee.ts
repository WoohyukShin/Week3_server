import { Skill } from '../Skill';
import Player from '../player';
import * as GAME_CONSTANTS from '../../constants/constants';

export default class Coffee extends Skill {
  constructor(owner: Player) {
    super(owner);
    this.name = 'coffee';
    this.description = '5초간 몰입 게이지 감소 없음';
    this.cooldown = 15;
  }

  execute(): void {
    this.onUse();
    this.owner.playerMotion = 'coffee';
    // SFX 재생 신호
    if (this.owner.game && this.owner.game.broadcast) {
      this.owner.game.broadcast('playSkillSfx', { type: 'coffee' });
    }
    (this.owner as any).isFlowProtected = true;
    setTimeout(() => {
      (this.owner as any).isFlowProtected = false;
    }, GAME_CONSTANTS.CAFFEINE_BUFF_DURATION_MS);
  }
} 