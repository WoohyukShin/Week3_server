// Room & Game Settings
export const MAX_PLAYERS_PER_ROOM: number = 4;
export const TICKS_PER_SECOND: number = 25;
export const GAME_TICK_INTERVAL: number = 1000 / TICKS_PER_SECOND; // 1초마다 게임 루프 실행

// COMMIT 게이지
export const INITIAL_COMMIT_GAUGE: number = 0;
export const MAX_COMMIT_GAUGE: number = 100;

export const COMMIT_GAUGE_PER_SECOND: number = 10; // 초당 commit 게이지 증가량
export const COMMIT_GAUGE_PER_TICK: number = COMMIT_GAUGE_PER_SECOND / TICKS_PER_SECOND;

// 몰입 게이지
export const INITIAL_FLOW_GAUGE: number = 100;
export const MAX_FLOW_GAUGE: number = 100;
export const FLOW_GAUGE_PENALTY_THRESHOLD: number = 50;

export const FLOW_GAUGE_DECREASE_PER_SECOND: number = 10; // 초당 몰입 게이지 감소량
export const FLOW_GAUGE_DECREASE_PER_TICK: number = FLOW_GAUGE_DECREASE_PER_SECOND / TICKS_PER_SECOND ;

export const FLOW_GAUGE_INCREASE_PER_SECOND: number = 20; // 춤 출때 초당 몰입 게이지 증가량
export const FLOW_GAUGE_INCREASE_PER_TICK: number = FLOW_GAUGE_INCREASE_PER_SECOND / TICKS_PER_SECOND;

// Push Mechanics
// push 성공 확률 = PUSH_SUCCESS_BASE_RATE * commitCount
export const PUSH_SUCCESS_BASE_RATE: number = 0.2; // commit 1회당 성공 확률 20%

// '운영진' Event
export const MANAGER_APPEARANCE_PROBABILITY: number = 0.03; // 매 틱마다 운영진이 등장할 확률 3%

// 모션 시간
export const MANAGER_KILL_DELAY_MS = 600; // 운영진 모션 시간
export const PUSH_ANIMATION_DURATION_MS = 500; // PUSH 모션 시간
