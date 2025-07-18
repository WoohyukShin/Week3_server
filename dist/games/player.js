"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants/constants");
class Player {
    constructor(socketId, username) {
        this.socketId = socketId;
        this.username = username;
        this.isAlive = true;
        this.isDancing = false;
        this.commitGauge = constants_1.INITIAL_COMMIT_GAUGE;
        this.flowGauge = constants_1.INITIAL_FLOW_GAUGE;
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
    getInfo() {
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
exports.default = Player;
//# sourceMappingURL=player.js.map