import Circle from './Circle';
import Ball from './Ball';

const LINE_WIDTH = 3;
const ACCELERATION = 0.025;
const DECELERATION = 0.015;
const TOP_SPEED = 1.1;
const RADIUS = 15;
const PLAYER_MASS = 10;

export default class Player extends Circle {
    constructor(color) {
        super(
            { x: 0, y: 0 },
            RADIUS,
            LINE_WIDTH,
            { x: 0, y: 0 },
            PLAYER_MASS,
            color,
            ACCELERATION,
            DECELERATION
        );
    }

    accelerate() {
        const topSpeed = this.actions.has('fire') ? TOP_SPEED / 2 : TOP_SPEED;
        super.accelerate(topSpeed);
    }

    decelerate() {
        const topSpeed = this.actions.has('fire') ? TOP_SPEED / 2 : TOP_SPEED;
        super.decelerate(topSpeed);
    }

    interact(element) {
        if (!this.team) {
            return false;
        }
        if (element instanceof Ball) {
            return element.interact(this);
        }
        return super.interact(element);
    }

    store() {
        return {
            x: this.position.x,
            y: this.position.y,
            speedX: this.speed.x,
            speedY: this.speed.y,
            actions: Array.from(this.actions),
            team: this.team,
        };
    }

    setTeam(team) {
        this.team = team;
        if (this.team) {
            if (team === 'a') {
                this.color = 'red';
            } else {
                this.color = 'blue';
            }
        }
    }

    restore(obj) {
        this.position.x = obj.x;
        this.position.y = obj.y;
        this.speed.x = obj.speedX;
        this.speed.y = obj.speedY;
        this.actions = new Set(obj.actions);
        this.setTeam(obj.team);
    }

    draw(ctx) {
        if (!this.team) {
            return;
        }
        super.draw(ctx);
    }
}
