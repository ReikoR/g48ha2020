const center = [58.378025, 26.728493];

const map = L.map('map',{
    center,
    zoom: 15
    });
    
L.control.scale().addTo(map);

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

const activeMachines = L.layerGroup();
const inactiveMachines = L.layerGroup();

const overlays = {
    Active: activeMachines,
    Inactive: inactiveMachines
}

const layerControl = L.control.layers(baseLayers, overlays);
layerControl.addTo(map);



/* layerControl.addOverlay(activeMachines, 'active refill');
layerControl.addOverlay(inActiveMachines, 'inactive refill');
 */
