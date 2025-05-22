function showMap() {
    let defaultCoords = { lat: 49.26504440741209, lng: -123.11540318587558 };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                initializeMap(userCoords);
            },
            (error) => {
                console.warn("Geolocation error:", error.message);
                initializeMap(defaultCoords);
            }
        );
    } else {
        console.error("Geolocation is not supported.");
        initializeMap(defaultCoords);
    }

}
function initializeMap(coords) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidG9ueXhjaGVuIiwiYSI6ImNtOGdjMGYydTBsdjcyaW9pa2xqNWw3ODUifQ.zNywMAWcRkug0iD3Aej6hw';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coords.lng, coords.lat],
        zoom: 11
    });

    // Marker for user location
    new mapboxgl.Marker({ color: 'rgba(118, 164, 210, 0.8)' })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(new mapboxgl.Popup().setText("Your Location"))
        .addTo(map);

    // ✅ Add quest markers
    if (typeof quests !== 'undefined' && Array.isArray(quests)) {
        quests.forEach(quest => {
            if (quest.coordinates && quest.coordinates.lat && quest.coordinates.lng) {
                new mapboxgl.Marker({ color: 'rgba(92, 203, 92, 0.8)'  })
                    .setLngLat([quest.coordinates.lng, quest.coordinates.lat])
                    .setPopup(new mapboxgl.Popup().setHTML(`
                        <h3>${quest.questTitle}</h3>
                        <p>${quest.questLocation}</p>
                        <p><strong>Mission:</strong> ${quest.questMission}</p>
                    `))
                    .addTo(map);
            }
        });
    }

    window.globalMap = map;
}

showMap();

