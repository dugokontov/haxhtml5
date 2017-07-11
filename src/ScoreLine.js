import Rectangle from './Rectangle';
import Ball from './Ball';

export default class ScoreLine extends Rectangle {
    constructor(
        team,
        topLeftX,
        topLeftY,
        width,
        height,
        mass,
        color,
        acceleration,
        deceleration
    ) {
        super(
            topLeftX,
            topLeftY,
            width,
            height,
            mass,
            color,
            acceleration,
            deceleration
        );

        this._onScore = null;
        this.team = team;
    }

    set onScore(onScore) {
        this._onScore = onScore;
    }

    interact(ball) {
        if (!(ball instanceof Ball)) {
            return;
        }

        if (!this._onScore) {
            return;
        }

        if (this.isInteract(ball)) {
            this._onScore(this.team);
        }
    }
}
