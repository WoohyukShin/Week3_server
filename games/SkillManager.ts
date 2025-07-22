import Player from './player';
import { Skill } from './Skill';
import Bumpercar from './skills/bumpercar';
import Coffee from './skills/coffee';
import Exercise from './skills/exercise';
import GameSkill from './skills/game';
import Shotgun from './skills/shotgun';

type SkillClass = new (owner: Player, game: any) => Skill;

class SkillManager {
  skills: Map<string, SkillClass>;

  constructor() {
    this.skills = new Map();
    // 타입스크립트 default import로 명확하게 등록
    console.log('[SkillManager] Bumpercar import:', Bumpercar);
    this.skills.set('bumpercar', Bumpercar);
    this.skills.set('coffee', Coffee);
    this.skills.set('exercise', Exercise);
    this.skills.set('game', GameSkill);
    this.skills.set('shotgun', Shotgun);
    console.log('[SkillManager] skills Map keys:', Array.from(this.skills.keys()));
    console.log('[SkillManager] skills Map bumpercar:', this.skills.get('bumpercar'));
  }

  assignRandomSkill(player: Player, game: any): Skill | null {
    const skillNames = Array.from(this.skills.keys());
    console.log('[SkillManager] assignRandomSkill skillNames:', skillNames);
    
    if (skillNames.length === 0) {
      console.warn('No skills available to assign.');
      return null;
    }
    const randomSkillName = skillNames[Math.floor(Math.random() * skillNames.length)];
    const SkillClass = this.skills.get(randomSkillName);
    console.log('[SkillManager] assignRandomSkill SkillClass:', SkillClass, 'for', randomSkillName);
    if (!SkillClass) {
      console.error(`Could not find class for skill: ${randomSkillName}`);
      return null;
    }
    const skillInstance = new SkillClass(player, game);
    player.skill = skillInstance;
    console.log(`[SkillManager] Assigned skill '${randomSkillName}' to player ${player.username}`, skillInstance);
    return skillInstance;
  }
}

const instance = new SkillManager();
export default instance;
