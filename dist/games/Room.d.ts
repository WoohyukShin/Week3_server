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
    roomManager: RoomManager;
    constructor(roomId: string, hostPlayer: Player, roomManager: RoomManager);
    addPlayer(player: Player): void;
    removePlayer(socketId: string): void;
    getPlayer(socketId: string): Player | undefined;
    isFull(): boolean;
    isEmpty(): boolean;
    startGame(io: Server): void;
    broadcast(event: string, data: any): void;
    getState(): RoomState;
}
export default Room;
//# sourceMappingURL=Room.d.ts.map