import Circle from './Circle';
import Player from './Player';

const RADIUS = 10;
const LINE_WIDTH = 3;
const BALL_MASS = 2;
const ACCELERATION = 0.025;
const DECELERATION = 0.015;
const TOP_SPEED = 10;

export default class Ball extends Circle {
    constructor(position) {
        super(
            position,
            RADIUS,
            LINE_WIDTH,
            { x: 0, y: 0 },
            BALL_MASS,
            'white',
            ACCELERATION,
            DECELERATION
        );
    }

    accelerate() {
        super.accelerate(TOP_SPEED);
    }

    decelerate() {
        super.decelerate(TOP_SPEED);
    }

    interact(element) {
        let boostMe = 0;
        if (element instanceof Player && element.actions.has('fire')) {
            boostMe = 2;
        }
        super.interact(element, boostMe);
    }

    store() {
        return {
            x: this.position.x,
            y: this.position.y,
            speedX: this.speed.x,
            speedY: this.speed.y,
        };
    }

    restore(obj) {
        this.position.x = obj.x;
        this.position.y = obj.y;
        this.speed.x = obj.speedX;
        this.speed.y = obj.speedY;
    }
}
