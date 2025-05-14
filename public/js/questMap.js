mapboxgl.accessToken = 'pk.eyJ1IjoidG9ueXhjaGVuIiwiYSI6ImNtOGdjMGYydTBsdjcyaW9pa2xqNWw3ODUifQ.zNywMAWcRkug0iD3Aej6hw'; 

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-123.1207, 49.2827], 
            zoom: 10
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