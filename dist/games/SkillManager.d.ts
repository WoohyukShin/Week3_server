import Player from './player';
import { Skill } from './Skill';
type SkillClass = new (owner: Player, game: any) => Skill;
declare class SkillManager {
    skills: Map<string, SkillClass>;
    constructor();
    assignRandomSkill(player: Player, game: any): Skill | null;
}
declare const instance: SkillManager;
export default instance;
//# sourceMappingURL=SkillManager.d.ts.map