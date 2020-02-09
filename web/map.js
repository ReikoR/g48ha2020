const center = [58.378025, 26.728493];

const map = L.map('map',{
    center,
    zoom: 15
    });
    
L.control.scale().addTo(map);

const satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

const streets = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

const baseLayers = {
    Satellite: satellite,
    Streets: streets
}

const geojsonLayer = L.geoJSON(null, {
    filter: (feature) => {
        for (let product of feature.properties.products) {
            if (checkboxStates.includes(product.type)) {
                return true;
            }
        }
        return false;
    },
    
    onEachFeature: function (feature, layer) {
        // address
        layer.bindTooltip(`<div>${feature.properties.address}</div>`, {
            direction: 'bottom', 
            permanent: true,
            className: 'custom-tooltip',
            opacity: 0.7
        }).openTooltip();

        // get all types
        types = {};
        for (const product of feature.properties.products) {
            if (!types.hasOwnProperty(product.type)) {
                types[product.type] = [product];
            } else {
                types[product.type].push(product);
            }
        }

        // machine content
        let popUpContent = '<section class="accordions">';
        for (const [type, products] of Object.entries(types)) {
            popUpContent += getAccordion(type, products);
        }
        popUpContent += `</section>`;

        layer.bindPopup(popUpContent).openPopup().on('popupopen', () => bulmaAccordion.attach());

    },
    // set custom icon
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: feature.properties.online ? greenIcon : greyIcon });
    }
}).addTo(map);


const layerControl = L.control.layers(baseLayers);
layerControl.addTo(map);

const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

