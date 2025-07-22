import { Skill } from '../Skill';
import Player from '../player';
import * as GAME_CONSTANTS from '../../constants/constants';

export default class GameSkill extends Skill {
  usesLeft: number;
  constructor(owner: Player) {
    super(owner);
    this.name = 'game';
    this.description = '미연시 플레이로 몰입 증가. 운영진 있어도 안전. 최대 3회.';
    this.cooldown = 10;
    this.usesLeft = 3;
  }

  execute(): void {
    if (this.usesLeft <= 0) return;
    (this.owner as any).playingGame = true;
    setTimeout(() => {
      (this.owner as any).playingGame = false;
    }, GAME_CONSTANTS.GAME_TIME_MS);
    this.usesLeft--;
    this.onUse();
  }
} 