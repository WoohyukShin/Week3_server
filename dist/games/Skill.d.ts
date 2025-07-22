import Player from './player';
import Game from './game';
declare abstract class Skill {
    owner: Player;
    game: Game;
    name: string;
    description: string;
    cooldown: number;
    lastUsed: number;
    /**
     * @param {Player} owner - 이 스킬을 소유한 플레이어
     * @param {Game} game - 게임 인스턴스
     */
    constructor(owner: Player, game: Game);
    /**
     * 스킬을 사용할 수 있는지 확인합니다.
     * @returns {boolean}
     */
    canUse(): boolean;
    /**
     * 스킬을 실행합니다. 이 메소드는 자식 클래스에서 반드시 오버라이드해야 합니다.
     * @param {Player[]} allPlayers - 게임에 참여 중인 모든 플레이어 배열
     * @param {Player} [target] - 스킬의 대상이 되는 특정 플레이어 (선택적)
     */
    abstract execute(allPlayers: Player[], target?: Player): void;
    onUse(): void;
}
export { Skill };
//# sourceMappingURL=Skill.d.ts.map