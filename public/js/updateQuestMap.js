document.addEventListener('DOMContentLoaded', function () {
  if (!mapboxgl || !document.getElementById('map')) return;

  mapboxgl.accessToken = 'pk.eyJ1IjoidG9ueXhjaGVuIiwiYSI6ImNtOGdjMGYydTBsdjcyaW9pa2xqNWw3ODUifQ.zNywMAWcRkug0iD3Aej6hw';

  const defaultCoords = [-123.1207, 49.2827];
  const mapCenter = (typeof questCoordinates !== 'undefined' && Array.isArray(questCoordinates))
    ? questCoordinates
    : defaultCoords;

  const originalCoordinates = [...mapCenter];

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: mapCenter,
    zoom: 13
  });

  let marker = new mapboxgl.Marker({ color: 'green' })
    .setLngLat(mapCenter)
    .addTo(map);

  const latInput = document.getElementById('latitude');
  const lngInput = document.getElementById('longitude');
  if (latInput && lngInput) {
    lngInput.value = mapCenter[0];
    latInput.value = mapCenter[1];
  }

  let isEditable = false;

  const editBtn = document.getElementById('editBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      isEditable = true;
    });
  }

  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      isEditable = false;

      if (marker) marker.remove();

      marker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat(originalCoordinates)
        .addTo(map);

      if (latInput && lngInput) {
        lngInput.value = originalCoordinates[0];
        latInput.value = originalCoordinates[1];
      }
    });
  }

  map.on('click', function (e) {
    if (!isEditable) return;

    const { lng, lat } = e.lngLat;

    if (marker) marker.remove();

    marker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([lng, lat])
      .addTo(map);

    if (latInput && lngInput) {
      lngInput.value = lng;
      latInput.value = lat;
    }
  });
});