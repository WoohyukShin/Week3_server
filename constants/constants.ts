// Room & Game Settings
export const MAX_PLAYERS_PER_ROOM: number = 4;
export const TICKS_PER_SECOND: number = 25;
export const GAME_TICK_INTERVAL: number = 1000 / TICKS_PER_SECOND; // 1초마다 게임 루프 실행

// 몰입 게이지
export const INITIAL_FLOW_GAUGE: number = 100;
export const MAX_FLOW_GAUGE: number = 100;
export const FLOW_GAUGE_PENALTY_THRESHOLD: number = 50;

export const FLOW_GAUGE_DECREASE_PER_SECOND: number = 10; // 초당 몰입 게이지 감소량
export const FLOW_GAUGE_DECREASE_PER_TICK: number = FLOW_GAUGE_DECREASE_PER_SECOND / TICKS_PER_SECOND ;

export const FLOW_GAUGE_INCREASE_PER_SECOND: number = 20; // 춤 출때 초당 몰입 게이지 증가량
export const FLOW_GAUGE_INCREASE_PER_TICK: number = FLOW_GAUGE_INCREASE_PER_SECOND / TICKS_PER_SECOND;

// '운영진' Event
export const MANAGER_APPEARANCE_PROBABILITY: number = 0.015; // 매 틱마다 운영진이 등장할 확률 1.5%

// 모션 시간
export const MANAGER_KILL_DELAY_MS = 1000; // 운영진 모션 시간
export const PUSH_ANIMATION_DURATION_MS = 500; // PUSH 모션 시간

// 스킬 밸런스
export const BUMPERCAR_FLOW_GAUGE_DECREASE_RATE: number = 0.7; // 범퍼카 스킬 사용 성공 시 몰입 게이지 감소 비율
export const BUMPERCAR_TIME_MS: number = 3000; // 노래 부르는 시간

export const SHOTGUN_COOLDOWN_MS: number = 5000; // 샷건 쿨타임

export const EXERCISE_COOLDOWN_MS: number = 3000; // 운동 쿨타임
export const EXERCISE_TIME_MS: number = 2000; // 운동 시간
export const MUSCLE_TO_WIN: number = 5; // 운동 승리 조건 달성 근육량

export const GAME_COOLDOWN_MS: number = 10000; // 게임 쿨타임
export const GAME_FLOW_GAUGE_RATE: number = 0.7; // 게임 스킬 사용 시 몰입 게이지 증가량 비율
export const GAME_TIME_MS: number = 3000; // 게임 시간

export const COFFEE_COOLDOWN_MS: number = 15000 // 커피 쿨타임
export const CAFFEINE_BUFF_DURATION_MS: number = 5000; // 커피 버프 시간