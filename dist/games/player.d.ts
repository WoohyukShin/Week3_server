import { Skill } from './Skill';
export interface PlayerInfo {
    socketId: string;
    username: string;
    isAlive: boolean;
    isDancing: boolean;
    commitGauge: number;
    flowGauge: number;
    commitCount: number;
    skill: string | null;
    bumpercar: boolean;
    isExercising: boolean;
    hasCaffeine: boolean;
    muscleCount: number;
}
declare class Player {
    socketId: string;
    username: string;
    isAlive: boolean;
    isDancing: boolean;
    commitGauge: number;
    flowGauge: number;
    commitCount: number;
    skill: Skill | null;
    bumpercar: boolean;
    isExercising: boolean;
    playingGame: boolean;
    hasCaffeine: boolean;
    muscleGauge: number;
    muscleCount: number;
    game?: any;
    constructor(socketId: string, username: string);
    getInfo(): PlayerInfo;
}
export default Player;
//# sourceMappingURL=player.d.ts.map