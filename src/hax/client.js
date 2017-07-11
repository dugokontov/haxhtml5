import Timeline from '../Timeline';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

let ws;
const playerId = uuidv4();
let timeCorrection, timeline;

export function joinGame(wsHost, name, gameId) {
    return new Promise((resolve, reject) => {
        timeline = new Timeline();
        ws = new WebSocket(wsHost);
        ws.onmessage = function({ data }) {
            const msg = JSON.parse(data);
            switch (msg.type) {
                case 'connected':
                    ws.send(gameId);
                    break;
                case 'added':
                    ws.send(
                        JSON.stringify({
                            type: 'join',
                            gameId,
                            player: playerId,
                            action: name,
                        })
                    );
                    break;
                case 'joined':
                    if (playerId === msg.player) {
                        timeline.game.restoreState(msg.snapshot);
                        timeline.loadActions(msg.actions);
                        resolve();
                    }
                    break;
                case 'ping':
                    ws.send(
                        JSON.stringify({
                            type: 'pong',
                            when: performance.now(),
                            player: playerId,
                        })
                    );
                    break;
                case 'correct-time':
                    if (playerId === msg.player) {
                        timeCorrection = msg.timeCorrection;
                    }
                    break;
                default:
                    timeline.registerAction(msg, timeCorrection);
            }
        };
    });
}

export function registerAction(type, action, idOfPlayer = playerId) {
    if (timeCorrection == null) {
        return;
    }
    ws.send(
        JSON.stringify({
            when: performance.now() + timeCorrection,
            player: idOfPlayer,
            type,
            action,
        })
    );
}

export function startRendering(ctx) {
    if (timeCorrection != null) {
        timeline.render(ctx, timeCorrection);
    }
    setTimeout(() => startRendering(ctx), 10);
}

export function keyDown(event) {
    switch (event.key) {
        case 'ArrowDown':
            registerAction('start', 'down');
            break;
        case 'ArrowUp':
            registerAction('start', 'up');
            break;
        case 'ArrowLeft':
            registerAction('start', 'left');
            break;
        case 'ArrowRight':
            registerAction('start', 'right');
            break;
        case ' ':
        default:
    }
}

export function keyUp(event) {
    switch (event.key) {
        case 'ArrowDown':
            registerAction('stop', 'down');
            break;
        case 'ArrowUp':
            registerAction('stop', 'up');
            break;
        case 'ArrowLeft':
            registerAction('stop', 'left');
            break;
        case 'ArrowRight':
            registerAction('stop', 'right');
            break;
        case ' ':
            registerAction('stop', 'fire');
            break;
        default:
    }
}

export function setOnPlayersChangedCb(cb) {
    timeline.game.onPlayerChange = cb;
}

export function getPlayers() {
    return timeline.getPlayers();
}

export function changeTeam(player, team) {
    registerAction('change-team', team, player.id);
}

export function startGame() {
    registerAction('game', 'start');
}
