import { Skill } from '../Skill';
import Player from '../player';
import Game from '../game';

export default class Shotgun extends Skill {
  usesLeft: number;
  constructor(owner: Player, game: Game) {
    super(owner, game);
    this.name = 'shotgun';
    this.description = '운영진 강제 등장. 최대 2회 사용.';
    this.cooldown = 5;
    this.usesLeft = 2;
  }

  execute(allPlayers: Player[]): void {
    if (this.usesLeft <= 0) return;
    this.usesLeft--;
    this.onUse();
    this.owner.playerMotion = 'shotgun';
    // SFX 재생 신호
    console.log('[DEBUG] 서버에서 playSkillSfx broadcast: shotgun');
    this.game.broadcast('playSkillSfx', { type: 'shotgun' });
  }
} 