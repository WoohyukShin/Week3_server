import * as GAME_CONSTANTS from '../constants/constants';
import Player, { PlayerInfo } from './player';
import { RoomManager } from './RoomManager';
import { Server } from 'socket.io';
import SkillManager from './SkillManager';

// 춤 종류 (나중에 더 추가할 예정)
const DANCE_MOTIONS = ['pkpk'];

export interface GameState {
  roomId: string;
  players: PlayerInfo[];
  isManagerAppeared: boolean;
}

type PlayerAction = 'startDancing' | 'stopDancing' | 'move' | 'push';

class Game {
  roomId: string;
  players: Player[];
  io: Server;
  gameInterval: NodeJS.Timeout | null;
  isManagerAppeared: boolean;
  roomManager: RoomManager;

  constructor(roomId: string, players: Player[], io: Server, roomManager: RoomManager) {
    this.roomId = roomId;
    this.players = players;
    this.io = io;
    this.roomManager = roomManager;
    this.gameInterval = null;
    this.isManagerAppeared = false;
  }

  start(): void {
    console.log(`🎮 Game.start() called for room: ${this.roomId}`);
    // 모든 플레이어에게 중복 없이 스킬 배정
    const assignedSkills = SkillManager.assignUniqueSkills(this.players, this);
    this.players.forEach((player, idx) => {
      player.skill = assignedSkills[idx];
      this.io.to(player.socketId).emit('skillAssigned', { skill: player.skill ? player.skill.name : null });
      console.log(`[Game.start] skillAssigned sent to ${player.username} (${player.socketId}):`, player.skill ? player.skill.name : null);
    });
    const room = this.roomManager.getRoom(this.roomId);
    if (room) room.resetSkillReady();
    this.broadcast('gameStarted', this.getGameState());
  }

  startGameLoop(): void {
    this.gameInterval = setInterval(() => this.tick(), GAME_CONSTANTS.GAME_TICK_INTERVAL);
    this.io.to(this.roomId).emit('startGameLoop');
    console.log(`⏰ Game interval started for room: ${this.roomId}`);
  }

  tick(): void {
    this.handleManagerEvent();
    this.players.forEach(player => {
      if (!player.isAlive) return;
      this.updatePlayerGauges(player);
      this.checkPlayerStatus(player);
    });
    this.broadcast('gameStateUpdate', this.getGameState());
    this.checkEndCondition();
  }

  handleManagerEvent(forceAppear: boolean = false): void {
    const randomValue = Math.random();
    var shouldAppear = randomValue < GAME_CONSTANTS.MANAGER_APPEARANCE_PROBABILITY;
    if (forceAppear) {
      shouldAppear = true;
      return;
    }
    if (shouldAppear && !this.isManagerAppeared) {
      this.isManagerAppeared = true;
      this.broadcast('managerAppeared', {});
      setTimeout(() => this.killPlayers(), GAME_CONSTANTS.MANAGER_KILL_DELAY_MS);
    }
  }

  killPlayers(): void {
    this.players.forEach(player => {
      if (DANCE_MOTIONS.includes(player.playerMotion) || player.playerMotion == 'exercise' || player.playerMotion == 'bumpercar') {
        player.isAlive = false;
        this.broadcast('playerDied', { socketId: player.socketId, reason: 'Manager' });
      }
    });
    this.isManagerAppeared = false;
  }

  updatePlayerGauges(player: Player): void {
    if (DANCE_MOTIONS.includes(player.playerMotion)) { // dancing일 때 몰입 게이지 증가
      player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge + 
        GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK);
    } else if (player.playerMotion === 'gaming') { // gaming일 때 몰입 게이지 덜 증가
      player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge + 
        GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK * GAME_CONSTANTS.GAME_FLOW_GAUGE_RATE);
    } else if ((player as any).isFlowProtected || player.playerMotion !== 'coding') {
      return; // 커피 버프 중 or 운동, 노래 부를 때는 몰입 게이지 변화 없음
    } else {
      player.flowGauge = Math.max(0, player.flowGauge - GAME_CONSTANTS.FLOW_GAUGE_DECREASE_PER_TICK);
    }
  }

  checkPlayerStatus(player: Player): void {
    if (player.flowGauge <= 0) {
      player.isAlive = false;
      this.broadcast('playerDied', { socketId: player.socketId, reason: 'flow' });
    }
  }

  checkEndCondition(): void {
    const alivePlayers = this.players.filter(p => p.isAlive);
    if (alivePlayers.length <= 1) this.endGame(alivePlayers[0] || null);
  }

  endGame(winner: Player | null): void {
    if (this.gameInterval) clearInterval(this.gameInterval);

    const endTime = Date.now();
    const room = this.roomManager.getRoom(this.roomId);
    const totalTimeMs = endTime - (room?.startTime ?? endTime);
    const formattedTime = `${Math.floor(totalTimeMs / 60000).toString().padStart(2, '0')}:${Math.floor((totalTimeMs % 60000) / 1000).toString().padStart(2, '0')}`;

  this.players.forEach((player) => {
    const resultData = {
      winnerSocketId: winner?.socketId ?? '',
      skill: player.skill?.name || '',
      time: formattedTime,
    };
    this.io.to(player.socketId).emit('gameEnded', resultData);
    console.log(`[Game.endGame] Sent gameEnded to ${player.username}`, resultData);
  });

  if (this.roomManager) {
    this.roomManager.rooms.delete(this.roomId);
    console.log(`[${this.roomId}] Room deleted after game ended`);
  }
}

  handlePlayerAction(socketId: string, action: PlayerAction, data: any): void {
    const player = this.players.find(p => p.socketId === socketId);
    if (!player || !player.isAlive) return;
    switch (action) {
      case 'startDancing':
        player.playerMotion = data.danceType;
        break;
      case 'stopDancing':
        player.playerMotion = 'coding';
        break;
      // push 관련 case 삭제
    }
  }

  handleSkillUse(socketId: string): void {
    const player = this.players.find(p => p.socketId === socketId);
    console.log("[DEBUG] Game.ts : handleSkillUse : ", player?.skill?.name);
    if (player && player.skill) {
      player.skill.execute(this.players);
    }
  }

  // animationComplete 이벤트 처리
  handleAnimationComplete(socketId: string, type: string): void {
    console.log("[DEBUG] Game.ts : handleAnimationComplete : ", type);
    const player = this.players.find(p => p.socketId === socketId);
    if (!player) return;
    if (type === 'coffee') {
      player.playerMotion = 'coding';
    } else if (type === 'shotgun') {
      player.playerMotion = 'coding';
      this.isManagerAppeared = true;
      this.broadcast('managerAppeared', {});
    }
  }

  broadcast(event: string, data: any): void {
    this.io.to(this.roomId).emit(event, data);
  }

  getGameState(): GameState {
    return {
      roomId: this.roomId,
      players: this.players.map(p => p.getInfo()),
      isManagerAppeared: this.isManagerAppeared,
    };
  }
}

export default Game;
