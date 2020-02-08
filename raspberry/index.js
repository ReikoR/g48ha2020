require('dotenv').config();

const SerialPort = require('serialport');
const WebSocket = require('ws-reconnect');
const ws = new WebSocket(process.env.SERVER_URL, {
    retryCount: -1,
    reconnectInterval: 3
});

const state = { inUse: false, filled: 0, paid: 0, dispensingProduct: null };

// Serial
const serial = new SerialPort(process.env.SERIAL_PATH);
const parser = new SerialPort.parsers.Readline();

serial.pipe(parser);

parser.on('data', data => {
    if (!state.machine || !state.inUse) {
        return;
    }

    const match = data.match(/^<btn(\d+):(\d)>$/);
    
    if (!match) {
        return;
    }

    const btnIndex = match[1];
    const btnPressed = !parseInt(match[2]);
    const productId = process.env[`PRODUCT_${btnIndex}_ID`];

    if (btnPressed && !state.dispensingProduct) {
        state.dispensingProduct = state.machine.products.find(
            product => product.id === productId
        );

        state.dispensingProduct.filled = 0;
        state.dispensingProduct.paid = 0;

        ws.send(JSON.stringify({
            event: 'updateProduct',
            data: {
                id: state.dispensingProduct.id,
                dispensing: true,
                filled: state.dispensingProduct.filled,
                paid: state.dispensingProduct.paid
            }
        }));
    } else if (!btnPressed && state.dispensingProduct) {
        ws.send(JSON.stringify({
            event: 'updateProduct',
            data: {
                id: state.dispensingProduct.id,
                dispensing: false
            }
        }));

        state.dispensingProduct = null;
    }
});

setInterval(() => {
    if (!state.machine || !state.inUse) {
        return;
    }

    if (state.dispensingProduct) {
        serial.write("sd:25:0:0\n");

        const delta = Math.min(state.dispensingProduct.available, 0.025);
        state.dispensingProduct.available -= delta;
        state.dispensingProduct.filled += delta;
        state.dispensingProduct.paid += delta * state.dispensingProduct.price;

        ws.send(JSON.stringify({
            event: 'updateProduct',
            data: {
                id: state.dispensingProduct.id,
                available: state.dispensingProduct.available,
                filled: state.dispensingProduct.filled,
                paid: state.dispensingProduct.paid
            }
        }));
    } else {
        serial.write("sd:0:0:0\n");
    }
}, 100);

// WS
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
        case 'start':
            if (data.id === process.env.MACHINE_ID) {
                state.inUse = true;
                state.filled = 0;
                state.paid = 0;
                state.dispensingProduct = null;
            }
            break;
        case 'end':
            if (data.id === process.env.MACHINE_ID) {
                state.inUse = false;
                state.filled = 0;
                state.paid = 0;
                state.dispensingProduct = null;
            }
            break;
    }
});

ws.start();
