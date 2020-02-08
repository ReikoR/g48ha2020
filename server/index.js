const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const products = {
    P1: { id: 'P1', type: 'dishwashing', name: 'Fairy', price: 2.3 },
    P2: { id: 'P2', type: 'soap', name: 'Decent Liquid Soap', price: 3.5 },
    P3: { id: 'P3', type: 'shampoo', name: 'Dove Shampoo', price: 4.2 }
};

const machines = {
    M1: { id: 'M1', lat: 52, lng: 22, online: true, products: [products.P1, products.P2, products.P3] },
    M2: { id: 'M2', lat: 52.2, lng: 22.1, online: false, products: [] },
    M3: { id: 'M3', lat: 51.3, lng: 21.6, online: false, products: [] }
};

wss.on('connection', ws => {
    for (let id in machines) {
        ws.send(JSON.stringify({
            event: 'addMachine',
            data: machines[id]
        }));
    }

    ws.on('message', json => {
        const data = JSON.parse(json);

        switch (data.event) {
        }
    });
});
