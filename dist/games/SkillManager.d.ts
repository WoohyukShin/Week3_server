import Player from './player';
import { Skill } from './Skill';
type SkillClass = new (owner: Player) => Skill;
declare class SkillManager {
    skills: Map<string, SkillClass>;
    constructor();
    assignRandomSkill(player: Player): Skill | null;
}
declare const instance: SkillManager;
export default instance;
//# sourceMappingURL=SkillManager.d.ts.map