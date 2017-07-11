import Shape from './Shape';

export default class Rectangle extends Shape {
    constructor(
        topLeftX,
        topLeftY,
        width,
        height,
        mass,
        color,
        acceleration,
        deceleration
    ) {
        super({ x: 0, y: 0 }, acceleration, deceleration);
        this.topLeftX = topLeftX;
        this.topLeftY = topLeftY;
        this.width = width;
        this.height = height;
        this.mass = mass;
        this.color = color;
    }

    accelerate() {
        super.accelerate(0);
    }

    decelerate() {
        super.decelerate(0);
    }

    isInteract(circle) {
        // distance from center of circle and rectangle
        const distX = Math.abs(
            circle.position.x - this.topLeftX - this.width / 2
        );
        const distY = Math.abs(
            -circle.position.y - -this.topLeftY - this.height / 2
        );

        if (distX > this.width / 2 + circle.radius + 1) {
            return false;
        }

        if (distY > this.height / 2 + circle.radius + 1) {
            return false;
        }

        if (distX <= this.width / 2) {
            return true;
        }

        if (distY <= this.height / 2) {
            return true;
        }

        const dx = distX - this.width / 2;
        const dy = distY - this.height / 2;

        return dx ** 2 + dy ** 2 <= circle.radius ** 2;
    }

    interact(circle) {
        if (circle instanceof Rectangle) {
            return;
        }

        if (!this.isInteract(circle)) {
            return;
        }

        if (circle.position.y > this.topLeftY) {
            if (circle.speed.y < 0) {
                circle.speed.y = -circle.speed.y;
            }
            return;
        }

        if (circle.position.y < this.topLeftY - this.height) {
            if (circle.speed.y > 0) {
                circle.speed.y = -circle.speed.y;
            }
            return;
        }

        if (circle.position.x < this.topLeftX) {
            if (circle.speed.x > 0) {
                circle.speed.x = -circle.speed.x;
            }
            return;
        }

        if (circle.position.x > this.topLeftX + this.width) {
            if (circle.speed.x < 0) {
                circle.speed.x = -circle.speed.x;
            }
            return;
        }

        return;
    }

    move() {}

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.topLeftX, -this.topLeftY, this.width, this.height);
    }
}
