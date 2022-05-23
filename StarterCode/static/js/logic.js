// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: []
});

function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3>
    <p>${new Date((feature.properties.time))}</p>
    <p>Magnitude: ${(feature.properties.mag)}</p>
    <p>Signifigance: ${(feature.properties.sig)}</p>
    <p>Depth: ${(feature.geometry.coordinates[2])}</p>
    `)
};
function getColor(d) {
    return d > 90 ? '#ff0000' :
    d > 70 ? '#f93312' :
        d > 50 ? '#f35e23' :
            d > 40 ? '#ee8334' :
                d > 30 ? '#e9a244' :
                    d > 20 ? '#e5bb53' :
                        d > 10 ? '#e2cf62' :
                            '#dfdf70';
}

function styleFeature(feature, latlng) {
    return L.circleMarker(latlng, {
        fillOpacity: feature.geometry.coordinates[2] /30,
        color: getColor(feature.geometry.coordinates[2]),
        fillColor: getColor(feature.geometry.coordinates[2]),
        radius: Math.sqrt(feature.properties.mag)*7,
    });
}
let earthquakes = new L.LayerGroup()


d3.json(queryUrl).then(function (data) {
    console.log("earthquakedata:", data);
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    var quakes = L.geoJSON(data, {
        // Run the onEachFeature function once for each piece of data in the array.
        onEachFeature: onEachFeature,
        // pointToLayer will style as defined in styleFeature
        pointToLayer: styleFeature
        // first add it to var created above- if you dont then you cant access the data to reference below
    }).addTo(earthquakes)
});

earthquakes.addTo(myMap);


var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

var overlayMaps = {
    Earthquakes: earthquakes
};
// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Create an overlay object to hold our overlay.


// Create our map, giving it the streetmap and earthquakes layers to display on load.
