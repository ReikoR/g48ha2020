const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const products = {
    // Physicum
    P1: { id: 'P1', type: 'dishwashing', name: 'Fairy', price: 2.3, capacity: 20, available: 18, dispensing: false },
    P2: { id: 'P2', type: 'soap', name: 'Decent Liquid Soap', price: 3.5, capacity: 20, available: 16.7, dispensing: false },
    P3: { id: 'P3', type: 'shampoo', name: 'Dove Shampoo', price: 4.2, capacity: 20, available: 4.3, dispensing: false },
    // Aparaaditehas
    P4: { id: 'P4', type: 'soap', name: 'Dove Soap', price: 1.7, capacity: 10, available: 5.3, dispensing: false },
    P5: { id: 'P5', type: 'soap', name: 'Decent Liquid Soap', price: 3.5, capacity: 20, available: 16.7, dispensing: false },
    P6: { id: 'P6', type: 'shampoo', name: 'Dove Shampoo', price: 4.2, capacity: 20, available: 4.3, dispensing: false },
    // Barlova
    P7: { id: 'P7', type: 'dishwashing', name: 'Fairy', price: 2.3, capacity: 20, available: 18, dispensing: false },
    P8: { id: 'P8', type: 'shampoo', name: 'Head & Shoulders', price: 4.1, capacity: 20, available: 11.3, dispensing: false },
    P9: { id: 'P9', type: 'shampoo', name: 'Dove Shampoo', price: 4.2, capacity: 20, available: 4.3, dispensing: false }
};

const machines = {
    M1: { id: 'M1', address: 'Physicum', lat: 58.366347, lng: 26.690936, online: true, products: [products.P1, products.P2, products.P3] },
    M2: { id: 'M2', address: 'Aparaaditehas', lat: 58.370533, lng: 26.716076, online: false, products: [products.P4, products.P5, products.P6] },
    M3: { id: 'M3', address: 'Barlova', lat: 58.369698, lng: 26.727855, online: false, products: [products.P7, products.P8, products.P9] }
};

wss.on('connection', ws => {
    ws.send(JSON.stringify({
        event: 'info',
        data: {
            machineCount: Object.values(machines).length
        }
    }));

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
