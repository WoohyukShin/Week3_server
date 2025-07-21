"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUMPERCAR_FLOW_GAUGE_DECREASE_RATE = exports.PUSH_ANIMATION_DURATION_MS = exports.MANAGER_KILL_DELAY_MS = exports.MANAGER_APPEARANCE_PROBABILITY = exports.PUSH_SUCCESS_BASE_RATE = exports.FLOW_GAUGE_INCREASE_PER_TICK = exports.FLOW_GAUGE_INCREASE_PER_SECOND = exports.FLOW_GAUGE_DECREASE_PER_TICK = exports.FLOW_GAUGE_DECREASE_PER_SECOND = exports.FLOW_GAUGE_PENALTY_THRESHOLD = exports.MAX_FLOW_GAUGE = exports.INITIAL_FLOW_GAUGE = exports.COMMIT_GAUGE_PER_TICK = exports.COMMIT_GAUGE_PER_SECOND = exports.MAX_COMMIT_GAUGE = exports.INITIAL_COMMIT_GAUGE = exports.GAME_TICK_INTERVAL = exports.TICKS_PER_SECOND = exports.MAX_PLAYERS_PER_ROOM = void 0;
// Room & Game Settings
exports.MAX_PLAYERS_PER_ROOM = 4;
exports.TICKS_PER_SECOND = 25;
exports.GAME_TICK_INTERVAL = 1000 / exports.TICKS_PER_SECOND; // 1초마다 게임 루프 실행
// COMMIT 게이지
exports.INITIAL_COMMIT_GAUGE = 0;
exports.MAX_COMMIT_GAUGE = 100;
exports.COMMIT_GAUGE_PER_SECOND = 10; // 초당 commit 게이지 증가량
exports.COMMIT_GAUGE_PER_TICK = exports.COMMIT_GAUGE_PER_SECOND / exports.TICKS_PER_SECOND;
// 몰입 게이지
exports.INITIAL_FLOW_GAUGE = 100;
exports.MAX_FLOW_GAUGE = 100;
exports.FLOW_GAUGE_PENALTY_THRESHOLD = 50;
exports.FLOW_GAUGE_DECREASE_PER_SECOND = 10; // 초당 몰입 게이지 감소량
exports.FLOW_GAUGE_DECREASE_PER_TICK = exports.FLOW_GAUGE_DECREASE_PER_SECOND / exports.TICKS_PER_SECOND;
exports.FLOW_GAUGE_INCREASE_PER_SECOND = 20; // 춤 출때 초당 몰입 게이지 증가량
exports.FLOW_GAUGE_INCREASE_PER_TICK = exports.FLOW_GAUGE_INCREASE_PER_SECOND / exports.TICKS_PER_SECOND;
// Push Mechanics
// push 성공 확률 = PUSH_SUCCESS_BASE_RATE * commitCount
exports.PUSH_SUCCESS_BASE_RATE = 0.2; // commit 1회당 성공 확률 20%
// '운영진' Event
exports.MANAGER_APPEARANCE_PROBABILITY = 0.03; // 매 틱마다 운영진이 등장할 확률 3%
// 모션 시간
exports.MANAGER_KILL_DELAY_MS = 600; // 운영진 모션 시간
exports.PUSH_ANIMATION_DURATION_MS = 500; // PUSH 모션 시간
// 스킬 밸런스
exports.BUMPERCAR_FLOW_GAUGE_DECREASE_RATE = 0.7; // 범퍼카 스킬 사용 시 몰입 게이지 감소 비율
//# sourceMappingURL=constants.js.map