import Player, { PlayerInfo } from './player';
import { RoomManager } from './RoomManager';
import { Server } from 'socket.io';
export interface GameState {
    roomId: string;
    players: PlayerInfo[];
    isManagerAppeared: boolean;
}
type PlayerAction = 'startDancing' | 'stopDancing' | 'move' | 'push';
declare class Game {
    roomId: string;
    players: Player[];
    io: Server;
    gameInterval: NodeJS.Timeout | null;
    isManagerAppeared: boolean;
    roomManager: RoomManager;
    constructor(roomId: string, players: Player[], io: Server, roomManager: RoomManager);
    start(): void;
    startGameLoop(): void;
    tick(): void;
    handleManagerEvent(forceAppear?: boolean): void;
    killPlayers(): void;
    updatePlayerGauges(player: Player): void;
    checkPlayerStatus(player: Player): void;
    checkEndCondition(): void;
    endGame(winner: Player | null): void;
    handlePlayerAction(socketId: string, action: PlayerAction, data: any): void;
    handleSkillUse(socketId: string): void;
    handleAnimationComplete(socketId: string, type: string): void;
    broadcast(event: string, data: any): void;
    getGameState(): GameState;
}
export default Game;
//# sourceMappingURL=game.d.ts.map