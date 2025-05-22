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

  // Add user location marker with blue color
  new mapboxgl.Marker({ color: 'rgba(118, 164, 210, 0.8)' })
    .setLngLat([coords.lng, coords.lat])
    .setPopup(new mapboxgl.Popup().setText('Your Location'))
    .addTo(map);

  // Add quest markers
  if (typeof quests !== 'undefined' && Array.isArray(quests)) {
    quests.forEach(quest => {
      if (quest.coordinates && quest.coordinates.lat && quest.coordinates.lng) {
        // Create marker with custom color based on difficulty
        let markerColor = 'rgba(92, 203, 92, 0.8)'; // Default green
        if (quest.difficulty) {
          switch(quest.difficulty.toLowerCase()) {
            case 'easy':
              markerColor = 'rgba(92, 203, 92, 0.8)'; // Green
              break;
            case 'medium':
              markerColor = 'rgba(255, 196, 0, 0.8)'; // Yellow
              break;
            case 'hard':
              markerColor = 'rgba(255, 59, 48, 0.8)'; // Red
              break;
          }
        }

        new mapboxgl.Marker({ color: markerColor })
          .setLngLat([quest.coordinates.lng, quest.coordinates.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="min-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 8px;">${quest.questTitle}</h3>
                <p style="margin: 4px 0;"><strong>Target:</strong> ${quest.speciesName}</p>
                <p style="margin: 4px 0;"><strong>Time:</strong> ${quest.questTimeOfDay}</p>
                <p style="margin: 4px 0;"><strong>Difficulty:</strong> ${quest.difficulty || 'Not specified'}</p>
                <a href="/quests/${quest._id}" style="display: inline-block; margin-top: 8px; padding: 4px 8px; background: #16a34a; color: white; text-decoration: none; border-radius: 4px;">View Details</a>
              </div>
            `)
          )
          .addTo(map);
      }
    });
  }

  // Store the map globally
  window.globalMap = map;
}

showMap(); 