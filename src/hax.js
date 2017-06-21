import Player from './Player';
import Circle from './Circle';
import Ball from './Ball';

const objects = [];
let currentPlayer, randomPlayer, ctx;

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
    
    ctx.clearRect(0, 0, 600, 400);
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

export default c => {
    ctx = c;
    // create first player
    currentPlayer = new Player(c, '#fedcba');
    objects.push(currentPlayer);
    // create second player
    randomPlayer = new Player(c, '#abcdef');
    randomPlayer.position.x = 200;
    randomPlayer.position.y = -200;
    objects.push(randomPlayer);

    // create posts
    objects.push(new Circle(c, { x: 30, y: -250 }, 7, 3, { x: 0, y: 0 }, Infinity, '#acdcac', 0, 0));
    objects.push(new Circle(c, { x: 30, y: -150 }, 7, 3, { x: 0, y: 0 }, Infinity, '#acdcac', 0, 0));

    // create ball
    objects.push(new Ball(c));
    
    
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    setInterval(render, 10);
};
