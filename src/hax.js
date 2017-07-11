import Timeline from './Timeline';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

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
        default:
    }
};

let wsServer,
    gameId,
    currentPlayerId = uuidv4(),
    currentPlayerName,
    onJoinCallback,
    onPlayerChangeCallback,
    amIAdmin;

export function start(c) {
    timeline = new Timeline(c);
    if (amIAdmin) {
        // create me
        timeline.registerEvent({
            when: performance.now(),
            player: currentPlayerId,
            type: 'join',
            action: currentPlayerName,
        });
    }

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    const r = () => {
        timeline.render();
        setTimeout(r, 10);
    };

    r();
}

export function onJoin(cb) {
    onJoinCallback = cb;
}

export function onPlayerChange(cb) {
    onPlayerChangeCallback = cb;
}

export function getRoomId() {
    return gameId;
}

export function getPlayers() {
    return timeline.getPlayers();
}

export function joinGame(ws, name, room) {
    wsServer = new WebSocket(ws);
    currentPlayerName = name;

    wsServer.onmessage = function({ data }) {
        const msg = JSON.parse(data);
        let event;
        switch (msg.type) {
            case 'connected':
                if (room) {
                    gameId = room;
                } else {
                    gameId = uuidv4();
                }
                wsServer.send(gameId);
                break;
            case 'game-created':
                amIAdmin = msg.isAdmin;
                onJoinCallback();
                break;
            case 'join':
                if (amIAdmin) {
                    event = {
                        when: performance.now(),
                        player: msg.playerId,
                        type: 'join',
                        action: msg.name,
                    };
                    wsServer.send(JSON.stringify(event));
                } else {
                    event = msg;
                }
                timeline.registerEvent(event);
            default:
                throw new Error(`Unexpected type: ${msg.type}`);
        }
    };
}
