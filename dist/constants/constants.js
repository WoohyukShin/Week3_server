"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAFFEINE_BUFF_DURATION_MS = exports.COFFEE_COOLDOWN_MS = exports.GAME_TIME_MS = exports.GAME_FLOW_GAUGE_RATE = exports.GAME_COOLDOWN_MS = exports.MUSCLE_TO_WIN = exports.EXERCISE_TIME_MS = exports.EXERCISE_COOLDOWN_MS = exports.SHOTGUN_COOLDOWN_MS = exports.BUMPERCAR_TIME_MS = exports.BUMPERCAR_FLOW_GAUGE_DECREASE_RATE = exports.PUSH_ANIMATION_DURATION_MS = exports.MANAGER_KILL_DELAY_MS = exports.MANAGER_APPEARANCE_PROBABILITY = exports.FLOW_GAUGE_INCREASE_PER_TICK = exports.FLOW_GAUGE_INCREASE_PER_SECOND = exports.FLOW_GAUGE_DECREASE_PER_TICK = exports.FLOW_GAUGE_DECREASE_PER_SECOND = exports.FLOW_GAUGE_PENALTY_THRESHOLD = exports.MAX_FLOW_GAUGE = exports.INITIAL_FLOW_GAUGE = exports.GAME_TICK_INTERVAL = exports.TICKS_PER_SECOND = exports.MAX_PLAYERS_PER_ROOM = void 0;
// Room & Game Settings
exports.MAX_PLAYERS_PER_ROOM = 4;
exports.TICKS_PER_SECOND = 25;
exports.GAME_TICK_INTERVAL = 1000 / exports.TICKS_PER_SECOND; // 1초마다 게임 루프 실행
// 몰입 게이지
exports.INITIAL_FLOW_GAUGE = 100;
exports.MAX_FLOW_GAUGE = 100;
exports.FLOW_GAUGE_PENALTY_THRESHOLD = 50;
exports.FLOW_GAUGE_DECREASE_PER_SECOND = 10; // 초당 몰입 게이지 감소량
exports.FLOW_GAUGE_DECREASE_PER_TICK = exports.FLOW_GAUGE_DECREASE_PER_SECOND / exports.TICKS_PER_SECOND;
exports.FLOW_GAUGE_INCREASE_PER_SECOND = 20; // 춤 출때 초당 몰입 게이지 증가량
exports.FLOW_GAUGE_INCREASE_PER_TICK = exports.FLOW_GAUGE_INCREASE_PER_SECOND / exports.TICKS_PER_SECOND;
// '운영진' Event
exports.MANAGER_APPEARANCE_PROBABILITY = 0.03; // 매 틱마다 운영진이 등장할 확률 3%
// 모션 시간
exports.MANAGER_KILL_DELAY_MS = 1000; // 운영진 모션 시간
exports.PUSH_ANIMATION_DURATION_MS = 500; // PUSH 모션 시간
// 스킬 밸런스
exports.BUMPERCAR_FLOW_GAUGE_DECREASE_RATE = 0.7; // 범퍼카 스킬 사용 성공 시 몰입 게이지 감소 비율
exports.BUMPERCAR_TIME_MS = 3000; // 노래 부르는 시간
exports.SHOTGUN_COOLDOWN_MS = 5000; // 샷건 쿨타임
exports.EXERCISE_COOLDOWN_MS = 3000; // 운동 쿨타임
exports.EXERCISE_TIME_MS = 2000; // 운동 시간
exports.MUSCLE_TO_WIN = 5; // 운동 승리 조건 달성 근육량
exports.GAME_COOLDOWN_MS = 10000; // 게임 쿨타임
exports.GAME_FLOW_GAUGE_RATE = 0.7; // 게임 스킬 사용 시 몰입 게이지 증가량 비율
exports.GAME_TIME_MS = 3000; // 게임 시간
exports.COFFEE_COOLDOWN_MS = 15000; // 커피 쿨타임
exports.CAFFEINE_BUFF_DURATION_MS = 5000; // 커피 버프 시간
//# sourceMappingURL=constants.js.map