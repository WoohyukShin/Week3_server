import Game from './game';
import Player, { PlayerInfo } from './player';
import { RoomManager } from './RoomManager';
import { Server } from 'socket.io';
export interface RoomState {
    roomId: string;
    hostId: string;
    players: PlayerInfo[];
    isGameStarted: boolean;
}
declare class Room {
    roomId: string;
    players: Map<string, Player>;
    hostId: string;
    game: Game | null;
    startTime?: number;
    roomManager: RoomManager;
    skillReadySet: Set<string>;
    gameReadySet?: Set<string>;
    exitedPlayers: Set<string>;
    constructor(roomId: string, hostPlayer: Player, roomManager: RoomManager);
    addPlayer(player: Player): void;
    removePlayer(socketId: string): void;
    getPlayer(socketId: string): Player | undefined;
    isFull(): boolean;
    isEmpty(): boolean;
    startGame(io: Server): void;
    getState(): RoomState;
    resetSkillReady(): void;
    setSkillReady(socketId: string): void;
    getSkillReadyCount(): number;
    getTotalPlayerCount(): number;
    isAllSkillReady(): boolean;
    markPlayerExited(socketId: string): void;
    areAllPlayersExited(): boolean;
}
export default Room;
//# sourceMappingURL=Room.d.ts.map