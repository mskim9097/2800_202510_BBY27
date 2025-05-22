function showMap() {
  const defaultCoords = { lat: 49.26504440741209, lng: -123.11540318587558 };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        initializeMap(userCoords);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        initializeMap(defaultCoords);
      }
    );
  } else {
    console.error('Geolocation is not supported.');
    initializeMap(defaultCoords);
  }
}

function initializeMap(coords) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidG9ueXhjaGVuIiwiYSI6ImNtOGdjMGYydTBsdjcyaW9pa2xqNWw3ODUifQ.zNywMAWcRkug0iD3Aej6hw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [coords.lng, coords.lat],
    zoom: 11,
  });
  // add marker
  new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(map);

  // Store the map globally
  window.globalMap = map;
}

showMap();
