import Room from './Room';
import Player from './player';
import { Server } from 'socket.io';
export declare class RoomManager {
    io: Server;
    rooms: Map<string, Room>;
    constructor(io: Server);
    createRoom(hostPlayer: Player): Room;
    broadcastRoomList(): void;
    joinRoom(roomId: string, player: Player): Room;
    leaveRoom(roomId: string, socketId: string): void;
    getRoom(roomId: string): Room | undefined;
    getRoomList(): {
        roomId: string;
        roomName: string;
        host: string;
    }[];
    generateRoomId(): string;
}
declare const getRoomManager: (io: Server) => RoomManager;
export default getRoomManager;
//# sourceMappingURL=RoomManager.d.ts.map