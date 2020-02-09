const web = {

 // Settings

    thisMachineID: 'M1',
    thisSocketAddress: 'ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080',

 // Connect and Watch

    socket: false,
    connect: f => {
        web.socket = new WebSocket(web.thisSocketAddress)
        web.socket.onmessage = function (event) {
            let msg = JSON.parse(event.data)
            if (
                msg.event === 'addMachine' &&
                msg.data.id === web.thisMachineID &&
                msg.data.products
                )
                web.readProducts(msg.data.products)
        }
    },

    sendMessage: msg => {
        if (!web.socket) return false
        web.socket.send(JSON.stringify(msg))
    },

 // Functions

    readProducts: dataArray => {
        if (!dataArray.length) return false
        console.log('Products updated.')
        /*app.updateProducts

        let ProductsToSetup = []
        let ribosome = dna => { return {
            id:    dna.id,
            vol:   dna.available / dna.capacity,
            label: dna.name
        }}
        let submitData = o => ProductsToSetup.push(ribosome(o))
        dataArray.map(submitData)*/

        api.setupProducts(dataArray)
    },

    userStartsUsingTheMachine: f => {
        /* DEPRECATED
        let msg = {
            event: 'start',
            data: {
                id: web.thisMachineID
            }
        }
        console.log('MSG: userStatsUsingTheMachine', msg)
        web.sendMessage(msg)
        */
        api.waitForServerResponce()
    },

    userFinishedOrder: f => {
        let msg = {
            event: 'end',
            data: {
                id: web.thisMachineID
            }
        }
        console.log('MSG: userFinishedOrder', msg)
        web.sendMessage(msg)
    },
/*
    listenForWelcome: f => {
        web.socket.onmessage = function (event) {
            let msg = JSON.parse(event.data)
            if (
                msg.event === 'updateMachine' &&
                msg.data.id === web.thisMachineID &&
                msg.data.online
                )
                api.confirmedServerResponce()
        }
    },
*/
    listenForWelcome: f => {
        web.socket.onmessage = function (event) {
            let msg = JSON.parse(event.data)
            if (
                msg.event === 'start' &&
                msg.data.id === web.thisMachineID
                )
                api.confirmedServerResponce()
        }
    },

    listenForDispense: f => {
        web.socket.onmessage = function (event) {
            let msg = JSON.parse(event.data)
            if (
                msg.event === 'updateProduct' &&
                msg.data.dispensing === true
                )
                api.weAreDispensing()
            if (
                msg.event === 'updateProduct' &&
                msg.data.dispensing === false
                )
                api.weAreNotDispensing()
            if (
                msg.event === 'updateProduct' &&
                ( msg.data.available || msg.data.filled )
                )
                api.liveProductUpdate(msg.data)
        }
    }

}

/*  EOF web.js */
