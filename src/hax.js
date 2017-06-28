import Timeline from './Timeline';

let timeline;

const keydown = event => {
    switch (event.key) {
        case 'ArrowDown':
            timeline.registerAction(performance.now(), 0, 'start', 'down');
            break;
        case 'ArrowUp':
            timeline.registerAction(performance.now(), 0, 'start', 'up');
            break;
        case 'ArrowLeft':
            timeline.registerAction(performance.now(), 0, 'start', 'left');
            break;
        case 'ArrowRight':
            timeline.registerAction(performance.now(), 0, 'start', 'right');
            break;
        case ' ':
            timeline.registerAction(performance.now(), 0, 'start', 'fire');
            break;
        case 's':
            timeline.registerAction(performance.now() - 50, 1, 'start', 'down');
            break;
        case 'w':
            timeline.registerAction(performance.now() - 50, 1, 'start', 'up');
            break;
        case 'a':
            timeline.registerAction(performance.now() - 50, 1, 'start', 'left');
            break;
        case 'd':
            timeline.registerAction(
                performance.now() - 50,
                1,
                'start',
                'right'
            );
            break;
        case 'x':
            timeline.registerAction(performance.now() - 50, 1, 'start', 'fire');
            break;
        default:
            break;
    }
};

const keyup = event => {
    switch (event.key) {
        case 'ArrowDown':
            timeline.registerAction(performance.now(), 0, 'stop', 'down');
            break;
        case 'ArrowUp':
            timeline.registerAction(performance.now(), 0, 'stop', 'up');
            break;
        case 'ArrowLeft':
            timeline.registerAction(performance.now(), 0, 'stop', 'left');
            break;
        case 'ArrowRight':
            timeline.registerAction(performance.now(), 0, 'stop', 'right');
            break;
        case ' ':
            timeline.registerAction(performance.now(), 0, 'stop', 'fire');
            break;
        case 's':
            timeline.registerAction(performance.now() - 50, 1, 'stop', 'down');
            break;
        case 'w':
            timeline.registerAction(performance.now() - 50, 1, 'stop', 'up');
            break;
        case 'a':
            timeline.registerAction(performance.now() - 50, 1, 'stop', 'left');
            break;
        case 'd':
            timeline.registerAction(performance.now() - 50, 1, 'stop', 'right');
            break;
        case 'x':
            timeline.registerAction(performance.now() - 50, 1, 'stop', 'fire');
            break;
        default:
            break;
    }
};

export default c => {
    timeline = new Timeline(c);

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    const r = () => {
        timeline.render();
        setTimeout(r, 10);
    };

    r();
};
