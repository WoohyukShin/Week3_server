import { MAX_PLAYERS_PER_ROOM } from '../constants/constants';
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

class Room {
  roomId: string;
  players: Map<string, Player>; // Map<socketId, Player>
  hostId: string;
  game: Game | null;
  roomManager: RoomManager;
  skillReadySet: Set<string>;
  gameReadySet?: Set<string>; // 게임 준비 완료한 플레이어 socketId 집합

  constructor(roomId: string, hostPlayer: Player, roomManager: RoomManager) {
    this.roomId = roomId;
    this.players = new Map();
    this.hostId = hostPlayer.socketId;
    this.game = null; // 게임이 시작되면 Game 인스턴스가 할당됩니다.
    this.roomManager = roomManager;
    this.skillReadySet = new Set();
    this.addPlayer(hostPlayer);
  }

  addPlayer(player: Player): void {
    if (this.isFull()) {
      throw new Error('The room is full.');
    }
    this.players.set(player.socketId, player);
  }

  removePlayer(socketId: string): void {
    this.players.delete(socketId);
    // 만약 호스트가 나가면, 다른 플레이어를 호스트로 지정할 수 있습니다.
    if (this.hostId === socketId && this.players.size > 0) {
      this.hostId = this.players.keys().next().value!;
    }
  }

  getPlayer(socketId: string): Player | undefined {
    return this.players.get(socketId);
  }

  isFull(): boolean {
    return this.players.size >= MAX_PLAYERS_PER_ROOM;
  }

  isEmpty(): boolean {
    return this.players.size === 0;
  }

  // 게임을 시작하는 메소드
  startGame(io: Server): void {
    if (this.game) {
      console.log(`Game already started in room ${this.roomId}`);
      return;
    }
    console.log(`Starting game in room ${this.roomId}`);
    this.game = new Game(this.roomId, Array.from(this.players.values()), io, this.roomManager);
    this.game.start();
  }

  // 방의 현재 상태를 반환
  getState(): RoomState {
    return {
      roomId: this.roomId,
      hostId: this.hostId,
      players: Array.from(this.players.values()).map(p => p.getInfo()),
      isGameStarted: !!this.game,
    };
  }

  // 모든 player가 스킬 설명을 읽고 OK 버튼을 눌렀는가 ?
  resetSkillReady() {
    this.skillReadySet.clear();
  }
  setSkillReady(socketId: string) {
    this.skillReadySet.add(socketId);
  }
  getSkillReadyCount(): number {
    return this.skillReadySet.size;
  }
  getTotalPlayerCount(): number {
    return this.players.size;
  }
  isAllSkillReady(): boolean {
    return this.skillReadySet.size === this.players.size;
  }
}

export default Room;
