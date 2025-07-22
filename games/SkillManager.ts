import Player from './player';
import { Skill } from './Skill';
import Bumpercar from './skills/bumpercar';
import Coffee from './skills/coffee';
import Exercise from './skills/exercise';
import GameSkill from './skills/game';
import Shotgun from './skills/shotgun';

type SkillClass = new (owner: Player) => Skill;

class SkillManager {
  skills: Map<string, SkillClass>;

  constructor() {
    this.skills = new Map();
    // 타입스크립트 default import로 명확하게 등록
    this.skills.set('bumpercar', Bumpercar);
    this.skills.set('coffee', Coffee);
    this.skills.set('exercise', Exercise);
    this.skills.set('game', GameSkill);
    this.skills.set('shotgun', Shotgun);
    console.log('SkillManager loaded skills:', Array.from(this.skills.keys()));
  }

  assignRandomSkill(player: Player): Skill | null {
    const skillNames = Array.from(this.skills.keys());
    
    if (skillNames.length === 0) {
      console.warn('No skills available to assign.');
      return null;
    }
    const randomSkillName = skillNames[Math.floor(Math.random() * skillNames.length)];
    const SkillClass = this.skills.get(randomSkillName);
    if (!SkillClass) {
      console.error(`Could not find class for skill: ${randomSkillName}`);
      return null;
    }
    const skillInstance = new SkillClass(player);
    player.skill = skillInstance;
    console.log(`Assigned skill '${randomSkillName}' to player ${player.username}`);
    return skillInstance;
  }
}

const instance = new SkillManager();
export default instance;
