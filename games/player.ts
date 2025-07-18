import { INITIAL_COMMIT_GAUGE, INITIAL_FLOW_GAUGE } from '../constants/constants';
import { Skill } from './Skill';

// getInfo 메소드가 반환하는 객체의 타입을 정의합니다.
export interface PlayerInfo {
  socketId: string;
  username: string;
  isAlive: boolean;
  isDancing: boolean;
  commitGauge: number;
  flowGauge: number;
  commitCount: number;
  skill: string | null;
  bumpercar: boolean;
  isExercising: boolean;
  hasCaffeine: boolean;
  muscleCount: number;
}

class Player {
  // socketID, 닉네임
  socketId: string;
  username: string;
  // 운영진 관리
  isAlive: boolean;
  isDancing: boolean;
  // 몰입 & COMMIT 게이지
  commitGauge: number;
  flowGauge: number;
  commitCount: number;
  // SKILLS
  skill: Skill | null;
  bumpercar: boolean; // 범퍼카?
  isExercising: boolean; // 운동 중?
  playingGame: boolean; // 게임 중?
  hasCaffeine: boolean; // 커피 마심
  muscleGauge: number; // 운동 게이지
  muscleCount: number; // 근육량

  constructor(socketId: string, username: string) {
    this.socketId = socketId;
    this.username = username;
    this.isAlive = true;
    this.isDancing = false;
    this.commitGauge = INITIAL_COMMIT_GAUGE;
    this.flowGauge = INITIAL_FLOW_GAUGE;
    this.commitCount = 0;
    this.skill = null;
    this.bumpercar = false;
    this.isExercising = false;
    this.playingGame = false;
    this.hasCaffeine = false;
    this.muscleGauge = 0;
    this.muscleCount = 0;
  }

  // 플레이어의 주요 정보를 객체로 반환 (클라이언트에 전송하기 위함)
  getInfo(): PlayerInfo {
    return {
      socketId: this.socketId,
      username: this.username,
      isAlive: this.isAlive,
      isDancing: this.isDancing,
      commitGauge: this.commitGauge,
      flowGauge: this.flowGauge,
      commitCount: this.commitCount,
      skill: this.skill ? this.skill.name : null,
      bumpercar: this.bumpercar,
      isExercising: this.isExercising,
      hasCaffeine: this.hasCaffeine,
      muscleCount: this.muscleCount,
    };
  }
}

export default Player;
