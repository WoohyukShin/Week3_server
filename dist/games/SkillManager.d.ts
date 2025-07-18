import Player from './player';
import { Skill } from './Skill';
type SkillClass = new (owner: Player) => Skill;
declare class SkillManager {
    skills: Map<string, SkillClass>;
    constructor();
    loadSkills(): void;
    /**
       플레이어에게 랜덤 스킬을 생성하여 부여합니다.
       @param {Player} player - 스킬을 받을 플레이어
       @returns {Skill|null}
     */
    assignRandomSkill(player: Player): Skill | null;
}
declare const instance: SkillManager;
export default instance;
//# sourceMappingURL=SkillManager.d.ts.map