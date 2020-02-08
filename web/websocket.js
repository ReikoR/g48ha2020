// Create WebSocket connection.
const socket = new WebSocket('ws://ec2-13-53-129-204.eu-north-1.compute.amazonaws.com:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    // socket.send('Hello Server!');
});

let totalMachines = null;
// Listen for messages
socket.addEventListener('message', function (json) {
    const { event, data } = JSON.parse(json.data);

    console.log('Message from server ', event, data);

    switch(event) {
        case 'info':
            totalMachines = data.machineCount;
            break;
        case 'addMachine':
            addMachine(data);
            break;
    }

    if (machines.length === totalMachines) {
        console.log(machines.length);
        setTimeout(() => {
            map.fitBounds(markers.getBounds());
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

const machines = [];

function addMachine(data) {
    console.log('Data', data);
    
    machines.push(data);

    const marker = L.marker([data.lat, data.lng],
        { icon: data.online ? greenIcon : greyIcon });
    
    types = {};
    for (const product of data.products) {
        if (!types.hasOwnProperty(product.type)) {
            types[product.type] = [product];
        } else {
            types[product.type].push(product);
        }

        switch (product.type) {
            case 'soap':
                soap.addLayer(marker);
            case 'diswashing':
                diswashing.addLayer(marker);
            case 'shampoo':
                shampoo.addLayer(marker);
        }
    }

    let popUpContent = '<section class="accordions">';
    for (const [type, products] of Object.entries(types)) {
        popUpContent += getAccordion(type, products);
    }
    popUpContent += `</section>`;

    
    marker.bindTooltip(`<div>${data.address}</div>`, {
        direction: 'bottom', 
        permanent: true,
        className: 'custom-tooltip',
        opacity: 0.7
    }).openTooltip();

    marker.bindPopup(popUpContent).openPopup().on('popupopen', () => bulmaAccordion.attach());

   
        
    markers.addLayer(marker);
}
