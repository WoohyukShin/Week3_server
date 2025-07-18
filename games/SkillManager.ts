import fs from 'fs';
import path from 'path';
import Player from './player';
import { Skill } from './Skill';

// new 키워드로 호출 가능한 Skill 클래스의 생성자 타입을 정의합니다.
type SkillClass = new (owner: Player) => Skill;

class SkillManager {
  skills: Map<string, SkillClass>;

  constructor() {
    this.skills = new Map(); // Map<skillName, SkillClass>
    this.loadSkills();
  }

  loadSkills(): void {
    const skillsDir = path.join(__dirname, 'skills');
    
    if (!fs.existsSync(skillsDir)) {
        fs.mkdirSync(skillsDir);
    }

    const skillFiles = fs.readdirSync(skillsDir).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of skillFiles) {
      try {
        const module = require(path.join(skillsDir, file));
        // CommonJS (module.exports = X)와 ES Module (export default X) 모두 호환되도록 처리
        const SkillClass: SkillClass = module.default || module;
        
        // 파일 이름을 기반으로 스킬 이름을 생성 (예: caffeine.ts -> caffeine)
        const skillName = path.basename(file, path.extname(file));
        this.skills.set(skillName, SkillClass);
        console.log(`Loaded skill: ${skillName}`);
      } catch (err) {
        console.error(`Failed to load skill from ${file}:`, err);
      }
    }
  }

  /**
     플레이어에게 랜덤 스킬을 생성하여 부여합니다.
     @param {Player} player - 스킬을 받을 플레이어
     @returns {Skill|null}
   */
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
