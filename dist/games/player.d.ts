import { Skill } from './Skill';
export interface PlayerInfo {
    socketId: string;
    username: string;
    isAlive: boolean;
    playerMotion: string;
    flowGauge: number;
    skill: string | null;
    muscleCount: number;
}
declare class Player {
    socketId: string;
    username: string;
    isAlive: boolean;
    playerMotion: string;
    flowGauge: number;
    skill: Skill | null;
    muscleGauge: number;
    muscleCount: number;
    game?: any;
    constructor(socketId: string, username: string);
    getInfo(): PlayerInfo;
}
export default Player;
//# sourceMappingURL=player.d.ts.map