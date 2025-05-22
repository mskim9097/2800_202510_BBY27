mapboxgl.accessToken =
  'pk.eyJ1IjoidG9ueXhjaGVuIiwiYSI6ImNtOGdjMGYydTBsdjcyaW9pa2xqNWw3ODUifQ.zNywMAWcRkug0iD3Aej6hw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-123.1207, 49.2827],
  zoom: 10,
});

let marker;

map.on('click', function (e) {
  const { lng, lat } = e.lngLat;

  // Removing old marker if it already exists after previous click
  if (marker) marker.remove();

  // Adding a neew marker each time we click on the map
  marker = new mapboxgl.Marker({ color: 'green' })
    .setLngLat([lng, lat])
    .addTo(map);

  document.getElementById('latitude').value = lat;
  document.getElementById('longitude').value = lng;
});

// AI generated code to get current location.
map.on('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        // Remove old marker if it exists
        if (marker) {
          marker.remove();
        }

        // Add a new marker at the current location
        marker = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Center the map on the current location
        map.setCenter([longitude, latitude]);
        map.setZoom(14); // Adjust zoom level as needed

        // Update the input fields
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
      },
      (error) => {
        console.error('Error getting current location:', error);
        // Optionally, handle errors (e.g., user denies location access)
      }
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
});
