import Player from './Player';
import Circle from './Circle';
import Ball from './Ball';
import Rectangle from './Rectangle';
import ScoreLine from './ScoreLine';

const objects = [];
const players = [];
let currentPlayer, randomPlayer, ctx, teamAScoreLine, teamBScoreLine, ball;
let game = {
    score: {
        a: 0,
        b: 0,
    },
};

const render = () => {
    objects.forEach(p => {
        p.accelerate();
        p.decelerate();
    });
    for (let i = objects.length - 1; i > 0; i -= 1) {
        const basePlayer = objects[i];
        for (let j = i - 1; j >= 0; j -= 1) {
            const iteractPlayer = objects[j];
            basePlayer.interact(iteractPlayer);
        }
    }
    
    ctx.clearRect(0, 0, 650, 450);
    objects.forEach(p => {
        p.move(objects);
        p.draw();
    });
}

const keydown = event => {
    switch (event.key) {
    case 'ArrowDown':
        currentPlayer.actions.add('down');
        break;
    case 'ArrowUp':
        currentPlayer.actions.add('up');
        break;
    case 'ArrowLeft':
        currentPlayer.actions.add('left');
        break;
    case 'ArrowRight':
        currentPlayer.actions.add('right');
        break;
    case ' ':
        currentPlayer.actions.add('fire');
        break;
    case 's':
        randomPlayer.actions.add('down');
        break;
    case 'w':
        randomPlayer.actions.add('up');
        break;
    case 'a':
        randomPlayer.actions.add('left');
        break;
    case 'd':
        randomPlayer.actions.add('right');
        break;
    case 'x':
        randomPlayer.actions.add('fire');
        break;
    default:
        break;
    }
}

const keyup = event => {
    switch (event.key) {
    case 'ArrowDown':
        currentPlayer.actions.delete('down');
        break;
    case 'ArrowUp':
        currentPlayer.actions.delete('up');
        break;
    case 'ArrowLeft':
        currentPlayer.actions.delete('left');
        break;
    case 'ArrowRight':
        currentPlayer.actions.delete('right');
        break;
    case ' ':
        currentPlayer.actions.delete('fire');
        break;
    case 's':
        randomPlayer.actions.delete('down');
        break;
    case 'w':
        randomPlayer.actions.delete('up');
        break;
    case 'a':
        randomPlayer.actions.delete('left');
        break;
    case 'd':
        randomPlayer.actions.delete('right');
        break;
    case 'x':
        randomPlayer.actions.delete('fire');
        break;
    default:
        break;
    }
}

const displayScore = () => {
    console.log(`A ${game.score.a} - ${game.score.b} B`);
}

const score = (team) => {
    game.score[team] += 1;
    teamAScoreLine.onScore = null;
    teamBScoreLine.onScore = null;
    setTimeout(positionMovables, 3000);
    console.log('GOOOOOOAAAAAAALLLL!!!!!!!!!');
    displayScore();
}

const positionMovables = () => {
    const teamA = players.filter(p => p.team === 'a');
    const teamB = players.filter(p => p.team === 'b');

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

    ball.position.x = 300;
    ball.position.y = -200;
    ball.speed.x = 0;
    ball.speed.y = 0;

    teamAScoreLine.onScore = score;
    teamBScoreLine.onScore = score;
}

export default c => {
    ctx = c;
    // create first player
    currentPlayer = new Player(c, '#fedcba');
    currentPlayer.team = 'a';
    objects.push(currentPlayer);
    players.push(currentPlayer);
    // create second player
    randomPlayer = new Player(c, '#abcdef');
    randomPlayer.team = 'b';
    objects.push(randomPlayer);
    players.push(randomPlayer);

    // create posts
    objects.push(new Circle(c, { x: 20, y: -250 }, 7, 3, { x: 0, y: 0 }, Infinity, '#acdcac', 0, 0));
    objects.push(new Circle(c, { x: 20, y: -150 }, 7, 3, { x: 0, y: 0 }, Infinity, '#acdcac', 0, 0));

    objects.push(new Circle(c, { x: 580, y: -250 }, 7, 3, { x: 0, y: 0 }, Infinity, '#acdcac', 0, 0));
    objects.push(new Circle(c, { x: 580, y: -150 }, 7, 3, { x: 0, y: 0 }, Infinity, '#acdcac', 0, 0));

    // create ball
    ball = new Ball(c, { x: 300, y: -200 });
    objects.push(ball);

    // create obstacles 
    objects.push(new Rectangle(c, 5, -5, 595, 2, Infinity, 'black', 0, 0));
    objects.push(new Rectangle(c, 5, -5, 2, 395, Infinity, 'black', 0, 0));
    objects.push(new Rectangle(c, 5, -400, 595, 2, Infinity, 'black', 0, 0));
    objects.push(new Rectangle(c, 600, -5, 2, 395, Infinity, 'black', 0, 0));

    // add score lines
    teamAScoreLine = new ScoreLine(c, 'b', 20, -150, 2, 100, 0, 'gray', 0, 0);
    teamBScoreLine = new ScoreLine(c, 'a', 580, -150, 2, 100, 0, 'gray', 0, 0);

    objects.push(teamAScoreLine, teamBScoreLine);
    
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    const r = () => {
        render();
        setTimeout(r, 10);
    }

    displayScore();
    positionMovables();

    r();
};
