const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const products = {
    P1: { id: 'P1', type: 'dishwashing', name: 'Fairy', price: 2.3, capacity: 20, available: 18, dispensing: false },
    P2: { id: 'P2', type: 'soap', name: 'Decent Liquid Soap', price: 3.5, capacity: 20, available: 16.7, dispensing: false },
    P3: { id: 'P3', type: 'shampoo', name: 'Dove Shampoo', price: 4.2, capacity: 20, available: 4.3, dispensing: false }
};

const machines = {
    M1: { id: 'M1', address: 'Physicum', lat: 58.366347, lng: 26.690936, online: true, products: [products.P1, products.P2, products.P3] },
    M2: { id: 'M2', address: 'Aparaaditehas', lat: 58.370533, lng: 26.716076, online: false, products: [] },
    M3: { id: 'M3', address: 'Barlova', lat: 58.369698, lng: 26.727855, online: false, products: [] }
};

wss.on('connection', ws => {
    for (let id in machines) {
        ws.send(JSON.stringify({
            event: 'addMachine',
            data: machines[id]
        }));
    }

    ws.on('message', json => {
        try {
            const { event, data } = JSON.parse(json);

            switch (event) {
                case 'updateProduct':
                    if (!(data.id in products)) {
                        throw new Error(`Product '${data.id}' not known`);
                    }

                    products[data.id] = {
                        ...products[data.id],
                        ...data
                    };

                    for (let client of wss.clients) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(json);
                        }
                    }
                    break;
            }
        } catch (err) {
            console.log(err);
        }
    });
});
