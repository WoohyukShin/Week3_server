import { Skill } from '../Skill';
import Player from '../player';
import Game from '../game';
import * as GAME_CONSTANTS from '../../constants/constants';

export default class Exercise extends Skill {
  constructor(owner: Player, game: Game) {
    super(owner, game);
    this.name = 'exercise';
    this.description = '운동을 시작함. 3초 동안 운동에 성공하면 근육량이 오름. 근육량이 꽉 차면 게임을 승리함.';
    this.cooldown = 3;
  }

  execute(): void {
    this.onUse();
    this.owner.playerMotion = 'exercise';
    // SFX 재생 신호
    console.log('[DEBUG] 서버에서 playSkillSfx broadcast: exercise');
    this.owner.game.broadcast('playSkillSfx', { type: 'exercise' });
    setTimeout(() => {
      if (this.owner.isAlive) {
        this.owner.playerMotion = 'coding';
        this.owner.muscleCount = this.owner.muscleCount + 1;
        if (this.owner.muscleCount >= GAME_CONSTANTS.MUSCLE_TO_WIN) {
          this.owner.game.broadcast('gameEnded', {
            winner: this.owner.socketId
          });
        }
      }
    }, GAME_CONSTANTS.EXERCISE_TIME_MS);
  }
} 