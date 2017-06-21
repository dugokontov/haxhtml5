import Circle from './Circle';

const RADIUS = 10;
const LINE_WIDTH = 3;
const BALL_MASS = 2;
const ACCELERATION = 0.025;
const DECELERATION = 0.015;
const TOP_SPEED = 10;

export default class Ball extends Circle {
    constructor(ctx) {
        super(
            ctx,
            { x: 50, y: -50 },
            RADIUS,
            LINE_WIDTH,
            { x: 0, y: 0 },
            BALL_MASS,
            'white',
            ACCELERATION,
            DECELERATION,
        );
    }

    accelerate() {
        super.accelerate(TOP_SPEED);
    }

    decelerate () {
        super.decelerate(TOP_SPEED);
    }
}
