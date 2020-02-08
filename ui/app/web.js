const web = {
    socket: false,
    connect: f => {
        socket = new WebSocket('ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080')
        socket.onmessage = function (event) {
            let msg = JSON.parse(event.data)
            if (msg.data && msg.data.products) web.readProducts(msg.data.products);
        }
    },
    readMessage: msgs => {
        
    },
    readProducts: dataArray => {
        let ProductsToSetup = []
        let ribosome = dna => { return {
            id:    dna.id,
            vol:   dna.available / dna.capacity,
            label: dna.name
        }}
        dataArray.map(el=>ProductsToSetup.push(ribosome(el)))
        api.setupProducts(ProductsToSetup)
    }
}