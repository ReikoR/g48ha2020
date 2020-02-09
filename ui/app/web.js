const web = {

    thisMachineID: 'M1',
    socket: false,

    connect: f => {
        socket = new WebSocket('ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080')
        socket.onmessage = function (event) {
            let msg = JSON.parse(event.data)
            if (
                msg.event === 'addMachine' &&
                msg.data.id === web.thisMachineID &&
                msg.data.products
                )
                web.readProducts(msg.data.products);
        }
    },

    readProducts: dataArray => {

        let ProductsToSetup = []
        let ribosome = dna => { return {
            id:    dna.id,
            vol:   dna.available / dna.capacity,
            label: dna.name
        }}
        let submitData = o => ProductsToSetup.push(ribosome(o))
        dataArray.map(submitData)

        api.setupProducts(ProductsToSetup)
    }

}

/*  EOF web.js */
