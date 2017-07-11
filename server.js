const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

const rooms = {};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(message);
        if (!ws.roomId) {
            ws.roomId = message;
            if (!rooms[ws.roomId]) {
                rooms[ws.roomId] = [];
                ws.admin = true;
            }
            rooms[ws.roomId].push(ws);
            ws.send(JSON.stringify({ type: 'added' }));
            return;
        }
        if (!ws.admin) {
            let admin = rooms[ws.roomId].find(ws => ws.admin);
            admin.send(message);
        } else {
            rooms[ws.roomId].forEach(ws => {
                if (!ws.admin) {
                    ws.send(message);
                }
            });
        }
    });

    ws.send('{"type":"connected"}');
});
