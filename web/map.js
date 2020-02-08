const center = [58.378025, 26.728493];

const map = L.map('map',{
    center,
    zoom: 15
    });

const satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

const streets = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

const baseLayers = {
    Satellite: satellite,
    Streets: streets
}

L.control.layers(baseLayers).addTo(map);