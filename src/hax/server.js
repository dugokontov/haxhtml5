import Timeline from '../Timeline';

const PING_INTERVAL = 2000;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

let pingTime;

export function createGame(wsHost) {
    return new Promise((resolve, reject) => {
        const gameId = uuidv4();
        const timeline = new Timeline();
        const ws = new WebSocket(wsHost);

        function ping() {
            pingTime = performance.now();
            ws.send(JSON.stringify({ type: 'ping' }));
        }

        function runPing() {
            ping();
            setTimeout(runPing, PING_INTERVAL);
        }

        ws.onmessage = function({ data }) {
            const msg = JSON.parse(data);
            switch (msg.type) {
                case 'connected':
                    ws.send(gameId);
                    runPing();
                    break;
                case 'added':
                    resolve(gameId);
                    break;
                case 'join':
                    if (gameId === msg.gameId) {
                        const {
                            snapshot,
                            actions,
                        } = timeline.getSafeSnapshot();
                        ws.send(
                            JSON.stringify({
                                type: 'joined',
                                player: msg.player,
                                snapshot,
                                actions,
                            })
                        );
                        var action = {
                            when: performance.now(),
                            player: msg.player,
                            type: 'join',
                            action: msg.action,
                        };
                        timeline.registerAction(action, 0);
                        ws.send(JSON.stringify(action));
                    }
                    break;
                case 'pong':
                    const now = performance.now();
                    const ping = (now - pingTime) / 2;
                    const timeCorrection = performance.now() - msg.when + ping;
                    ws.send(
                        JSON.stringify({
                            type: 'correct-time',
                            ping,
                            timeCorrection,
                            player: msg.player,
                        })
                    );
                    break;
                default:
                    timeline.registerAction(msg, 0);
                    ws.send(data);
            }
        };
    });
}
