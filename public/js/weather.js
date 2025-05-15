
const weatherCaption = document.getElementById('weather-caption');

navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability&models=gem_seamless`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        //used Ai to exactly extract the temp by the current time for accuracy
        const now = new Date();
        const nowIso = now.toISOString().slice(0, 13);

        const index = data.hourly.time.findIndex(t => t.startsWith(nowIso));
        const temp = data.hourly.temperature_2m[index];
        const rainChance = data.hourly.precipitation_probability[index];

        weatherCaption.textContent = `🌡️ ${temp}°C — ☔ Rain: ${rainChance}%`;
        if (rainChance < 30 && temp >8){
            document.getElementById("explore_time").textContent = "☀️ It's a great weather to explore !!";
        }
        else if(temp<0) {
            document.getElementById("explore_time").textContent = "Beware of snow, stay safe";
        }
        else{
            document.getElementById("explore_time").textContent = "🌧️ It’s always a good time to explore—just dress for the weather and stay safe!"
        }
    } catch (err) {
        weatherCaption.textContent = 'Failed to load weather';
        console.error(err);
    }
}, () => {
    weatherCaption.textContent = 'Location denied';
});
