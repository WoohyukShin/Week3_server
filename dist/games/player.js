"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants/constants");
class Player {
    constructor(socketId, username) {
        this.socketId = socketId;
        this.username = username;
        this.isAlive = true;
        this.playerMotion = 'coding';
        this.flowGauge = constants_1.INITIAL_FLOW_GAUGE;
        this.skill = null;
        this.muscleGauge = 0;
        this.muscleCount = 0;
    }
    // 플레이어의 주요 정보를 객체로 반환 (클라이언트에 전송하기 위함)
    getInfo() {
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
exports.default = Player;
//# sourceMappingURL=player.js.map