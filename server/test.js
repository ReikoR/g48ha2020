const WebSocket = require('ws');
const ws = new WebSocket('ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080');

ws.on('open', () => {
    ws.send(JSON.stringify({
        event: 'end',
        data: {
            id: 'M1'
        }
    }));
});

ws.on('message', json => {
    const data = JSON.parse(json);
    console.log(data);
});
