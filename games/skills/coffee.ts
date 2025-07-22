import { Skill } from '../Skill';
import Player from '../player';

export default class Coffee extends Skill {
  constructor(owner: Player) {
    super(owner);
    this.name = 'coffee';
    this.description = '5초간 몰입 게이지 감소 없음';
    this.cooldown = 15;
  }

  execute(): void {
    this.onUse();
    (this.owner as any).isFlowProtected = true;
    setTimeout(() => {
      (this.owner as any).isFlowProtected = false;
    }, 5000);
  }
} 