import { INITIAL_FLOW_GAUGE } from '../constants/constants';
import { Skill } from './Skill';

// getInfo 메소드가 반환하는 객체의 타입을 정의합니다.
export interface PlayerInfo {
  socketId: string;
  username: string;
  isAlive: boolean;
  playerMotion: string;
  flowGauge: number;
  skill: string | null;
  muscleCount: number;
}

class Player {
  // socketID, 닉네임
  socketId: string;
  username: string;
  // 운영진 관리
  isAlive: boolean;
  playerMotion: string; // 'coding' | 'pkpk' | 'bumpercar' | 'exercise' | 'coffee' | 'shotgun' | 'gaming'
  // 몰입 & COMMIT 게이지
  flowGauge: number;
  // SKILLS
  skill: Skill | null;
  muscleGauge: number; // 운동 게이지
  muscleCount: number; // 근육량
  game?: any; // skills에서 game 프로퍼티 접근을 위한 타입 선언

  constructor(socketId: string, username: string) {
    this.socketId = socketId;
    this.username = username;
    this.isAlive = true;
    this.playerMotion = 'coding';
    this.flowGauge = INITIAL_FLOW_GAUGE;
    this.skill = null;
    this.muscleGauge = 0;
    this.muscleCount = 0;
  }

  // 플레이어의 주요 정보를 객체로 반환 (클라이언트에 전송하기 위함)
  getInfo(): PlayerInfo {
    const info = {
      socketId: this.socketId,
      username: this.username,
      isAlive: this.isAlive,
      playerMotion: this.playerMotion,
      flowGauge: this.flowGauge,
      skill: this.skill ? this.skill.name : null,
      muscleCount: this.muscleCount,
    };
    return info;
  }
}

export default Player;
