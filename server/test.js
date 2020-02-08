const WebSocket = require('ws');

const ws = new WebSocket('ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080');

ws.on('open', () => {
    const json = JSON.stringify({
    });

    ws.send(json);
});

ws.on('message', json => {
    const data = JSON.parse(json);
    console.log(data);
});