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
    tick(): void;
    handleManagerEvent(): void;
    killPlayers(): void;
    updatePlayerGauges(player: Player): void;
    checkPlayerStatus(player: Player): void;
    checkEndCondition(): void;
    endGame(winner: Player | null): void;
    handlePlayerAction(socketId: string, action: PlayerAction, data: any): void;
    handlePush(player: Player): void;
    broadcast(event: string, data: any): void;
    getGameState(): GameState;
}
export default Game;
//# sourceMappingURL=game.d.ts.map