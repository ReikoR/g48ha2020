const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    /*
    ws.send(JSON.stringify({
        event: 'updateProduct',
        data: {
            id: 'P2',
            dispensing: true
        }
    }));
    */
});

ws.on('message', json => {
    const data = JSON.parse(json);
    console.log(data);
});
