// Create WebSocket connection.
const socket = new WebSocket('ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    // socket.send('Hello Server!');
});

let totalMachines = null;
let checkboxStates = [];

// Listen for messages
socket.addEventListener('message', function (json) {
    const { event, data } = JSON.parse(json.data);

    //console.log('Message from server ', event, data);

    switch(event) {
        case 'info':
            totalMachines = data.machineCount;
            break;
        case 'addMachine':
            addMachine(data);
            break;
    }

    if (machines.features.length === totalMachines) {
        setTimeout(() => {
            map.fitBounds(geojsonLayer.getBounds(), {
                padding: [50, 50]
            });
        });
    }
});

function getLevelClass(level) {
    if (level > 0.7) return 'is-success';
    if (level > 0.5 && level <= 0.7) return 'is-warning';
    if (level <= 0.5) return 'is-danger';
}

function getProcressBar(type, available, capacity) {
    return `<div class="progress-bar-container">
                <span class="progress-bar-name">${type}</span>
                <progress
                class="progress is-large ${getLevelClass(available/capacity)}" 
                value="${available}" 
                max="${capacity}">
                </progress>
            </div>`;
}

function getAccordionHeader(type, products) {
    let available = 0; 
    let capacity = 0;
    for (const product of products) {
        available += product.available;
        capacity += product.capacity;
    }
    
    return `<div class="accordion-header toggle">
                ${getProcressBar(type, available, capacity)}
            </div>`;
}

function getAccordionBody(products) {
    let body = ''
    for (const product of products) {
        body += getProcressBar(product.name, product.available, product.capacity);
    }
    return body;
}

function getAccordion(type, products) {
    return `<article class="accordion"> 
            ${getAccordionHeader(type, products)}
            <div class="accordion-body">
                <div class="accordion-content">
                    ${getAccordionBody(products)}
                </div>
            </div>
            </article>`;
}

function dataToGeoJson({ lat, lng, id, address, online, products }) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lng, lat]
        },
        "properties": {
            id,
            online,
            address,
            products
        }
    }
}

const machines = {
    "type": "FeatureCollection",
    "features": [
    ]
}

function addMachine(data) {
    machines.features.push(dataToGeoJson(data));
    updateCheckboxStates();
    geojsonLayer.addData(machines);
}
