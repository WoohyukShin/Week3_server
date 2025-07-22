import { Skill } from '../Skill';
import Player from '../player';
import Game from '../game';
export default class GameSkill extends Skill {
    usesLeft: number;
    constructor(owner: Player, game: Game);
    execute(): void;
}
//# sourceMappingURL=game.d.ts.map