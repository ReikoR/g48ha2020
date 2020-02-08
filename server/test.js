const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    const json = JSON.stringify({
    });

    ws.send(json);
});

ws.on('message', json => {
    const data = JSON.parse(json);
    console.log(data);
});
