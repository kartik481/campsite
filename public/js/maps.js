mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: campMap.geometry.coordinates,
    zoom: 9,
});

console.log(campMap.geometry.coordinates);
new mapboxgl.Marker().setLngLat(campMap.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25}).setHTML(
        `<h4>${campMap.name}</h4><p>${campMap.location}</p>`
    )
).addTo(map);
