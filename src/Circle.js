import Shape from './Shape';

const avaiableSpaceCombination = [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2],
    [3, 1],
    [1, 3],
    [1, 4],
    [4, 1],
    [2, 3],
    [3, 2],
    [3, 3],
    [1, Infinity],
    [Infinity, 1],
];

export default class Circle extends Shape {
    constructor(ctx, position, radius, borderWidth, speed, mass, color, acceleration, deceleration) {
        super(speed, acceleration, deceleration);
        this.ctx = ctx;
        this.position = position;
        this.radius = radius;
        this.borderWidth = borderWidth;
        this.mass = mass;
        this.color = color;
    }

    isInteract(circle) {
        const pos1 = this.position;
        const pos2 = circle.position;
        const minDistance = this.radius + circle.radius + 1;
        if (Math.abs(pos1.x - pos2.x) > minDistance) {
            return false;
        }
        if (Math.abs(pos1.y - pos2.y) > minDistance) {
            return false;
        }
        if (Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2) > minDistance) {
            return false;
        }

        if (this.speed.x !== 0 && Math.sign(this.speed.x) !== Math.sign(pos1.x - pos2.x)) {
            return true;
        }

        if (circle.speed.x !== 0 && Math.sign(circle.speed.x) !== Math.sign(pos2.x - pos1.x)) {
            return true;
        }

        if (this.speed.y !== 0 && Math.sign(this.speed.y) !== Math.sign(pos1.y - pos2.y)) {
            return true;
        }

        if (circle.speed.y !== 0 && Math.sign(circle.speed.y) !== Math.sign(pos2.y - pos1.y)) {
            return true;
        }

        return false;
    }

    getImpactVectors(theta) {
        const v = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2);
        let vxi, vyi;
        if (v === 0) {
            vxi = vyi = 0;
        } else {
            let alpha = Math.abs(Math.asin(this.speed.y / v));
            if (this.speed.x < 0) {
                alpha = Math.PI - alpha;
            }
            if (this.speed.y < 0) {
                alpha = -alpha;
            }
            vxi = Math.cos(alpha - theta) * v;
            vyi = Math.sin(alpha - theta) * v;
        }

        return { theta, vxi, vyi };
    }

    setSpeedVector({ vxi, vyi, theta }) {
        const v = Math.sqrt(vxi ** 2 + vyi ** 2);
        if (v === 0) {
            this.speed.x = this.speed.y = 0;
        } else {
            let alpha = Math.abs(Math.asin(vyi / v));
            if (vxi < 0) {
                alpha = Math.PI - alpha;
            }
            if (vyi < 0) {
                alpha = -alpha;
            }

            this.speed.x = Math.cos(alpha + theta) * v;
            this.speed.y = Math.sin(alpha + theta) * v;

            if (Math.abs(this.speed.x) < 0.001) {
                this.speed.x = 0;
            }

            if (Math.abs(this.speed.y) < 0.001) {
                this.speed.y = 0;
            }
        }
    }

    isIntersect(otherCircle) {
        if (!(otherCircle instanceof Circle)) {
            return false;
        }
        const pos1 = this.position;
        const pos2 = otherCircle.position;
        const minDistance = this.radius + otherCircle.radius;
        if (Math.abs(pos1.x - pos2.x) > minDistance) {
            return false;
        }
        if (Math.abs(pos1.y - pos2.y) > minDistance) {
            return false;
        }
        if (Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2) > minDistance) {
            return false;
        }

        return true;
    }

    move(otherElements) {
        const currentX = this.position.x;
        const currentY = this.position.y;

        let hasInteraction;
        let i = 0;

        do {
            const [xDiv, yDiv] = avaiableSpaceCombination[i];
            this.position.x = currentX + (this.speed.x / xDiv);
            this.position.y = currentY + (this.speed.y / yDiv);
            hasInteraction = otherElements.some(e => e !== this && this.isIntersect(e));
            i += 1;
        } while (i < avaiableSpaceCombination.length && hasInteraction)
        
        if (hasInteraction) {
            this.position.x = currentX;
            this.position.y = currentY;
        }
    }

    interact(element, boostMe = 0) {
        if (!(element instanceof Circle)) {
            return element.interact(this);
        }

        if (!this.isInteract(element)) {
            return false;
        }
        
        const pos1 = this.position;
        const pos2 = element.position;
        const minDistance = this.radius + element.radius + 1;

        // theta is impact angle
        let theta = Math.asin(Math.abs(pos1.y - pos2.y) / minDistance);
        if (Math.sign(-pos1.y + pos2.y) === Math.sign(pos1.x - pos2.x)) {
            theta = -theta;
        }

        const circle1 = this.getImpactVectors(theta);
        const circle2 = element.getImpactVectors(theta);

        const p1vxi = circle1.vxi;
        const p2vxi = circle2.vxi;

        if (this.mass === element.mass) {
            circle1.vxi = p2vxi;
            circle2.vxi = p1vxi;
        } else if (this.mass === Infinity || element.mass === Infinity) {
            if (this.mass === Infinity) {
                circle2.vxi = -p2vxi;
            }

            if (element.mass === Infinity) {
                circle1.vxi = -p1vxi;
            }
        } else {
            const vcm = ((this.mass * p1vxi) + (element.mass * p2vxi)) / (this.mass + element.mass);
            circle1.vxi = 2 * vcm - p1vxi;
            circle2.vxi = 2 * vcm - p2vxi;
        }

        if (boostMe) {
            circle1.vxi += boostMe;
            element.actions.delete('fire');
        }

        this.setSpeedVector(circle1);
        element.setSpeedVector(circle2);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.borderWidth;
        if (this.actions.has('fire')) {
            this.ctx.strokeStyle = 'blue';
        } else {
            this.ctx.strokeStyle = 'black';
        }
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.position.x, -this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
    }
}