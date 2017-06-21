export default class Shape {
    constructor(acceleration, deceleration) {
        this.actions = new Set();
        this.acceleration = acceleration;
        this.deceleration = deceleration;
    }

    accelerate(topSpeed) {
        this.actions.forEach(action => {
            switch (action) {
            case 'down':
                if (this.speed.y > -topSpeed) {
                    this.speed.y = Math.max(
                        this.speed.y - this.acceleration,
                        -topSpeed
                    );
                }
                break;
            case 'up':
                if (this.speed.y < topSpeed) {
                    this.speed.y = Math.min(
                        this.speed.y + this.acceleration,
                        topSpeed
                    );
                }
                break;
            case 'left':
                if (this.speed.x > -topSpeed) {
                    this.speed.x = Math.max(
                        this.speed.x - this.acceleration,
                        -topSpeed
                    );
                }
                break;
            case 'right':
                if (this.speed.x < topSpeed) {
                    this.speed.x = Math.min(
                        this.speed.x + this.acceleration,
                        topSpeed
                    );
                }
                break;
            case 'fire':
                // this.position.x += ;
                break;
            default:
                break;
            }
        });
    }

    decelerate (topSpeed) {
        let decelerate = false;
        // decelerate if:
        // 1. over the top speed
        // 2. going up but not pressing up
        // 3. going down but not pressing down
        decelerate = (Math.abs(this.speed.y) > topSpeed) ||
            (!this.actions.has('up') && this.speed.y > 0) ||
            (!this.actions.has('down') && this.speed.y < 0);

        if (decelerate) {
            this.speed.y -= this.deceleration * Math.sign(this.speed.y);
            if (Math.abs(this.speed.y) < this.deceleration) {
                this.speed.y = 0;
            }
        }

        decelerate = false;
        // decelerate if:
        // 1. over the top speed
        // 2. going right but not pressing right
        // 3. going left but not pressing left
        decelerate = (Math.abs(this.speed.x) > topSpeed) ||
            (!this.actions.has('right') && this.speed.x > 0) ||
            (!this.actions.has('left') && this.speed.x < 0);

        if (decelerate) {
            this.speed.x -= this.deceleration * Math.sign(this.speed.x);
            if (Math.abs(this.speed.x) < this.deceleration) {
                this.speed.x = 0;
            }
        }
    }
}
