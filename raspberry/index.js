require('dotenv').config();
const WebSocket = require('ws-reconnect');
const ws = new WebSocket(process.env.SERVER_URL, {
    retryCount: -1,
    reconnectInterval: 3
});

const state = { };

ws.on('connect', () => {
    ws.send(JSON.stringify({
        event: 'updateMachine',
        data: {
            id: process.env.MACHINE_ID,
            online: true
        }
    }))
});

ws.on('reconnect', () => {
    console.log('reconnect');
});

ws.on('destroyed', () => {
    console.log('destroyed');
});

ws.on('message', json => {
    const { event, data } = JSON.parse(json);

    switch (event) {
        case 'addMachine':
            if (data.id === process.env.MACHINE_ID) {
                state.machine = data;
            }
            break;
    }
});

ws.start();
