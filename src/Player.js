import Circle from './Circle';

const LINE_WIDTH = 3;
const ACCELERATION = 0.025;
const DECELERATION = 0.015;
const TOP_SPEED = 1.1;
const RADIUS = 15;
const PLAYER_MASS = 10;

export default class Player extends Circle {
    constructor(ctx, color) {
        super(ctx, { x: 0, y: 0 }, RADIUS, LINE_WIDTH, { x: 0, y: 0 }, PLAYER_MASS, color, ACCELERATION, DECELERATION);
    }

    accelerate() {
        const topSpeed = this.actions.has('fire') ? TOP_SPEED / 2 : TOP_SPEED;
        super.accelerate(topSpeed);
    }

    decelerate () {
        const topSpeed = this.actions.has('fire') ? TOP_SPEED / 2 : TOP_SPEED;
        super.decelerate(topSpeed);
    }
}