// Create WebSocket connection.
const socket = new WebSocket('ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    // socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (json) {
    const { event, data } = JSON.parse(json.data);
    console.log('Message from server ', event, data);
    addMachine(data);
});


function addMachine({ id, lat, lng, online, products}) {
    console.log('Add machine', id);

    const machine = L.marker([lat, lng]);

    if (online) {
        activeMachines.addLayer(machine)
    } else {
        inactiveMachines.addLayer(machine);
    }

    //map.fitBounds(activeMachines.getBounds());


    // Add overlay
    //layerControl.addOverlay()
}