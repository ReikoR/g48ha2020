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

/* const markers = L.featureGroup().on('click', (e) => {
    // Set marker to the center
    console.log('Clsiked on marker', e);
});
markers.addTo(map); */

const diswashing = L.layerGroup().addTo(map);
const soap = L.layerGroup().addTo(map);
const shampoo = L.layerGroup().addTo(map);

const overlays = {
    diswashing,
    soap,
    shampoo
}

const layerControl = L.control.layers(baseLayers, overlays);
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

