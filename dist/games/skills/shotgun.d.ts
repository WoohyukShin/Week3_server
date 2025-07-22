import { Skill } from '../Skill';
import Player from '../player';
import Game from '../game';
export default class Shotgun extends Skill {
    usesLeft: number;
    constructor(owner: Player, game: Game);
    execute(allPlayers: Player[]): void;
}
//# sourceMappingURL=shotgun.d.ts.map