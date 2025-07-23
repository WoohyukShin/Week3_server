import { Skill } from '../Skill';
import Player from '../player';
import Game from '../game';
import * as GAME_CONSTANTS from '../../constants/constants';

export default class GameSkill extends Skill {
  usesLeft: number;
  constructor(owner: Player, game: Game) {
    super(owner, game);
    this.name = 'game';
    this.description = '미연시 플레이로 몰입 증가. 운영진 있어도 안전. 최대 3회.';
    this.cooldown = GAME_CONSTANTS.GAME_COOLDOWN_MS + GAME_CONSTANTS.GAME_TIME_MS;
    this.usesLeft = 3;
  }

  execute(): void {
    if (this.isCooldown) return;
    if (this.usesLeft <= 0) return;
    this.owner.playerMotion = 'gaming';
    // SFX 재생 신호
    console.log('[DEBUG] 서버에서 playSkillSfx broadcast: game');
    this.game.broadcast('playSkillSfx', { type: 'game' });
    setTimeout(() => {
       this.owner.playerMotion = 'coding';
    }, GAME_CONSTANTS.GAME_TIME_MS);
    this.usesLeft--;
    this.onUse();
  }
} 