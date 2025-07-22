import * as GAME_CONSTANTS from '../constants/constants';
import Player, { PlayerInfo } from './player';
import { RoomManager } from './RoomManager';
import { Server } from 'socket.io';
import SkillManager from './SkillManager';

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
    this.players.forEach(player => {
      const SkillClass = SkillManager.skills.get('bumpercar');
      console.log('[Game.start] SkillClass:', SkillClass);
      console.log('[Game.start] Player name:', player.username);
      console.log('[Game.start] Player socketId:', player.socketId);
      if (SkillClass) {
        player.skill = new SkillClass(player);
        console.log('[Game.start] player.skill:', player.skill);
        console.log('[Game.start] player.skill.name:', player.skill ? player.skill.name : null);
        this.io.to(player.socketId).emit('skillAssigned', { skill: player.skill ? player.skill.name : null });
        console.log(`[Game.start] skillAssigned sent to ${player.username} (${player.socketId}):`, player.skill ? player.skill.name : null);
      }
    });
    // skillReadySet 초기화
    const room = this.roomManager.getRoom(this.roomId);
    if (room) {
      room.resetSkillReady();
    }
    this.broadcast('gameStarted', this.getGameState());
  }

  // 모든 플레이어가 OK(ready) 누르면 진짜 게임 시작
  startGameLoop(): void {
    this.gameInterval = setInterval(() => this.tick(), GAME_CONSTANTS.GAME_TICK_INTERVAL);
    console.log(`⏰ Game interval started for room: ${this.roomId}, tick interval: ${GAME_CONSTANTS.GAME_TICK_INTERVAL}ms`);
  }

  tick(): void {
    console.log(`🔄 Tick called for room: ${this.roomId}, isManagerAppeared: ${this.isManagerAppeared}`);
    this.handleManagerEvent();
    this.players.forEach(player => {
      if (!player.isAlive) return;
      this.updatePlayerGauges(player);
      this.checkPlayerStatus(player);
    });

    this.broadcast('gameStateUpdate', this.getGameState());
    this.checkEndCondition();
  }

  handleManagerEvent(): void {
    const randomValue = Math.random();
    const shouldAppear = randomValue < GAME_CONSTANTS.MANAGER_APPEARANCE_PROBABILITY;
    console.log(`🎲 Manager check: random=${randomValue.toFixed(3)}, threshold=${GAME_CONSTANTS.MANAGER_APPEARANCE_PROBABILITY}, shouldAppear=${shouldAppear}, isManagerAppeared=${this.isManagerAppeared}`);
    
    if (shouldAppear && !this.isManagerAppeared) {
      this.isManagerAppeared = true;
      console.log('🚨 Manager appeared! Setting isManagerAppeared = true');
      this.broadcast('managerAppeared', {});

      setTimeout(() => {
        console.log('⏰ Manager timeout - killing players and setting isManagerAppeared = false');
        this.killPlayers();
      }, GAME_CONSTANTS.MANAGER_KILL_DELAY_MS);
    }
  }

  killPlayers(): void {
    this.players.forEach(player => {
      if (player.isDancing) {
        player.isAlive = false;
        this.broadcast('playerDied', { socketId: player.socketId, reason: 'dancing' });
      }
    });
    this.isManagerAppeared = false;
    console.log('💀 Manager killed players and set isManagerAppeared = false');
  }

  updatePlayerGauges(player: Player): void {
    if (player.isDancing) {
      const oldFlow = player.flowGauge;
      player.flowGauge = Math.min(GAME_CONSTANTS.MAX_FLOW_GAUGE, player.flowGauge + GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK);
      console.log(`💃 [${player.username}] Dancing - Flow: ${oldFlow} → ${player.flowGauge} (+${GAME_CONSTANTS.FLOW_GAUGE_INCREASE_PER_TICK})`);
    } else {
      const oldFlow = player.flowGauge;
      player.flowGauge = Math.max(0, player.flowGauge - GAME_CONSTANTS.FLOW_GAUGE_DECREASE_PER_TICK);
      console.log(`😴 [${player.username}] Not dancing - Flow: ${oldFlow} → ${player.flowGauge} (-${GAME_CONSTANTS.FLOW_GAUGE_DECREASE_PER_TICK})`);

      let commitIncrease = GAME_CONSTANTS.COMMIT_GAUGE_PER_TICK;
      if (player.flowGauge < GAME_CONSTANTS.FLOW_GAUGE_PENALTY_THRESHOLD) {
        commitIncrease /= 2;
      }
      const oldCommit = player.commitGauge;
      player.commitGauge += commitIncrease;
      console.log(`📝 [${player.username}] Commit: ${oldCommit} → ${player.commitGauge} (+${commitIncrease})`);

      if (player.commitGauge >= GAME_CONSTANTS.MAX_COMMIT_GAUGE) {
        player.commitGauge = 0;
        player.commitCount++;
        console.log(`🎉 [${player.username}] Commit success! Count: ${player.commitCount}`);
        this.broadcast('commitSuccess', { socketId: player.socketId, commitCount: player.commitCount });
      }
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
    if (alivePlayers.length <= 1) {
      this.endGame(alivePlayers.length === 1 ? alivePlayers[0] : null);
    }
  }

  endGame(winner: Player | null): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    this.broadcast('gameEnded', { winner: winner ? winner.getInfo() : null });

    if (this.roomManager) {
      this.roomManager.rooms.delete(this.roomId);
      console.log(`[${this.roomId}] Room deleted after game ended`);
    }
  }

  /* endGame(winner: Player | null): void {
  if (this.gameInterval) {
    clearInterval(this.gameInterval);
  }

  const endTime = Date.now();
  const totalTimeMs = endTime - this.roomManager.getRoom(this.roomId)?.startTime!;
  const minutes = Math.floor(totalTimeMs / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((totalTimeMs % 60000) / 1000).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  this.players.forEach((player) => {
    const resultData = {
      winnerSocketId: winner?.socketId ?? null,
      commitCount: player.commitCount,
      skill: player.skill?.name || '',
      time: formattedTime,
    };
    this.io.to(player.socketId).emit('gameEnded', resultData);
  });

  // Clean up room
  if (this.roomManager) {
    this.roomManager.rooms.delete(this.roomId);
    console.log(`[${this.roomId}] Room deleted after game ended`);
  }
}
*/ // 게임 끝나고 결과창 나오고 다시 로비로 엑시트하는 구조?

  handlePlayerAction(socketId: string, action: PlayerAction, data: any): void {
    const player = this.players.find(p => p.socketId === socketId);
    if (!player || !player.isAlive) return;

    switch (action) {
      case 'startDancing':
        player.isDancing = true;
        break;
      case 'stopDancing':
        player.isDancing = false;
        break;
      case 'push':
        this.broadcast('pushStarted', { socketId: player.socketId });
        setTimeout(() => {
          this.handlePush(player);
        }, GAME_CONSTANTS.PUSH_ANIMATION_DURATION_MS);
        break;
    }
  }

  handlePush(player: Player): void {
    const successRate = player.commitCount * GAME_CONSTANTS.PUSH_SUCCESS_BASE_RATE;
    if (Math.random() < successRate) {
      this.endGame(player);
    } else {
      player.commitCount = 0;
      this.broadcast('pushFailed', { socketId: player.socketId });
    }
  }

  handleSkillUse(socketId: string): void {
    const player = this.players.find(p => p.socketId === socketId);
    if (player && player.skill) {
      console.log(`[SKILL] ${player.username} uses skill: ${player.skill.name}`);
      player.skill.execute(this.players);
      // 여기에 broadcast 추가??
    } else {
      console.log(`[SKILL] Player ${socketId} tried to use skill, but has none.`);
    }
  }

  broadcast(event: string, data: any): void {
    this.io.to(this.roomId).emit(event, data);
  }

  getGameState(): GameState {
    const gameState = {
      roomId: this.roomId,
      players: this.players.map(p => p.getInfo()),
      isManagerAppeared: this.isManagerAppeared,
    };
    console.log(`📊 Broadcasting GameState - isManagerAppeared: ${this.isManagerAppeared}, Players: ${this.players.length}`);
    return gameState;
  }
}

export default Game;