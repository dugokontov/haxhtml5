import Ball from './Ball';
import Player from './Player';
import Circle from './Circle';
import Rectangle from './Rectangle';
import ScoreLine from './ScoreLine';

export default class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.obsticles = [];
        this.players = [];
        this.teamAScoreLine = null;
        this.teamBScoreLine = null;
        this.ball = null;

        this.score = {
            a: 0,
            b: 0,
        };
    }

    createFieldElements() {
        // create field
        this.obsticles.push(
            new Rectangle(this.ctx, 5, -5, 595, 2, Infinity, 'black', 0, 0)
        );
        this.obsticles.push(
            new Rectangle(this.ctx, 5, -5, 2, 395, Infinity, 'black', 0, 0)
        );
        this.obsticles.push(
            new Rectangle(this.ctx, 5, -400, 595, 2, Infinity, 'black', 0, 0)
        );
        this.obsticles.push(
            new Rectangle(this.ctx, 600, -5, 2, 395, Infinity, 'black', 0, 0)
        );
        // create posts
        this.obsticles.push(
            new Circle(
                this.ctx,
                { x: 20, y: -250 },
                7,
                3,
                { x: 0, y: 0 },
                Infinity,
                '#acdcac',
                0,
                0
            )
        );
        this.obsticles.push(
            new Circle(
                this.ctx,
                { x: 20, y: -150 },
                7,
                3,
                { x: 0, y: 0 },
                Infinity,
                '#acdcac',
                0,
                0
            )
        );

        this.obsticles.push(
            new Circle(
                this.ctx,
                { x: 580, y: -250 },
                7,
                3,
                { x: 0, y: 0 },
                Infinity,
                '#acdcac',
                0,
                0
            )
        );
        this.obsticles.push(
            new Circle(
                this.ctx,
                { x: 580, y: -150 },
                7,
                3,
                { x: 0, y: 0 },
                Infinity,
                '#acdcac',
                0,
                0
            )
        );

        // add score lines
        this.teamAScoreLine = new ScoreLine(
            this.ctx,
            'b',
            20,
            -150,
            2,
            100,
            0,
            'gray',
            0,
            0
        );
        this.teamBScoreLine = new ScoreLine(
            this.ctx,
            'a',
            580,
            -150,
            2,
            100,
            0,
            'gray',
            0,
            0
        );

        this.obsticles.push(this.teamAScoreLine, this.teamBScoreLine);
        // add ball
        this.ball = new Ball(this.ctx, { x: 300, y: -200 });
    }

    addPlayers() {
        let player;
        // create first player
        player = new Player(this.ctx, '#fedcba');
        player.team = 'a';
        player.id = this.players.length;
        this.players.push(player);

        // create second player
        player = new Player(this.ctx, '#abcdef');
        player.team = 'b';
        player.id = this.players.length;
        this.players.push(player);
    }

    setInitPosition() {
        const teamA = this.players.filter(p => p.team === 'a');
        const teamB = this.players.filter(p => p.team === 'b');

        teamA.forEach((player, index) => {
            player.position.x = 100;
            player.position.y = -200;

            player.speed.x = 0;
            player.speed.y = 0;
        });

        teamB.forEach((player, index) => {
            player.position.x = 500;
            player.position.y = -200;

            player.speed.x = 0;
            player.speed.y = 0;
        });

        this.ball.position.x = 300;
        this.ball.position.y = -200;
        this.ball.speed.x = 0;
        this.ball.speed.y = 0;

        this.teamAScoreLine.onScore = this.onScore.bind(this);
        this.teamBScoreLine.onScore = this.onScore.bind(this);
    }

    onScore(team) {
        this.score[team] += 1;
        this.teamAScoreLine.onScore = null;
        this.teamBScoreLine.onScore = null;
        setTimeout(this.positionMovables.bind(this), 3000);
        console.log('GOOOOOOAAAAAAALLLL!!!!!!!!!');
        this.displayScore();
    }

    displayScore() {
        console.log(`A ${this.score.a} - ${this.score.b} B`);
    }

    storeState() {
        return {
            players: this.players.map(p => p.store()),
            ball: this.ball.store(),
            score: Object.assign({}, this.score),
        };
    }

    restoreState(state) {
        state.players.forEach((p, index) => this.players[index].restore(p));
        this.ball.restore(state.ball);
        this.score = state.score;
    }

    acceleratePlayers() {
        this.players.forEach(p => p.accelerate());
    }

    deceleratePlayers() {
        this.players.forEach(p => p.decelerate());
    }

    decelerateBall() {
        this.ball.decelerate();
    }

    applyAction(action) {
        action.applied = true;
        const player = this.players[action.player];
        if (action.type === 'start') {
            player.actions.add(action.action);
        } else {
            player.actions.delete(action.action);
        }
    }

    interact() {
        const objects = this.players.concat([this.ball]).concat(this.obsticles);

        for (let i = objects.length - 1; i > 0; i -= 1) {
            const baseObject = objects[i];
            for (let j = i - 1; j >= 0; j -= 1) {
                const interactObject = objects[j];
                baseObject.interact(interactObject);
            }
        }
    }

    move() {
        const objects = this.players.concat([this.ball]).concat(this.obsticles);

        this.players.forEach(p => p.move(objects));
        this.ball.move(objects);
    }

    render() {
        this.ctx.clearRect(0, 0, 650, 450);
        this.obsticles.forEach(p => p.draw());
        this.players.forEach(p => p.draw());
        this.ball.draw();
    }
}
