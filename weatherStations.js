// ==========================================
// weatherStations.js – Weather stations & periodic updates
// ==========================================

const apiKey = "b0e12e4c94cfd0f4b1f217a468ec3287";

// List of weather stations (city names and coordinates)
const weatherStations = [
    { en: "Jerusalem", coords: [31.7882, 35.2200] },
    { en: "Ramallah", coords: [31.9038, 35.2034] },
    { en: "Nablus", coords: [32.2211, 35.2544] },
    { en: "Jenin", coords: [32.4615, 35.3009] },
    { en: "Tubas", coords: [32.3167, 35.3667] },
    { en: "Tulkarm", coords: [32.3104, 35.0286] },
    { en: "Qalqilya", coords: [32.1896, 34.9706] },
    { en: "Salfit", coords: [32.0833, 35.1833] },
    { en: "Jericho", coords: [31.8667, 35.4500] },
    { en: "Bethlehem", coords: [31.7054, 35.2024] },
    { en: "Hebron", coords: [31.5353, 35.0998] },
    { en: "Al-Arroub", coords: [31.60, 35.13] },
    { en: "Wadi al-Far'a", coords: [32.24, 35.39] },
    { en: "Kardala", coords: [32.39, 35.54] },
    { en: "Duma", coords: [32.04, 35.37] },
    { en: "Gaza", coords: [31.5017, 34.4668] },
    { en: "Deir al-Balah", coords: [31.4178, 34.3503] },
    { en: "Khan Yunis", coords: [31.3469, 34.3063] },
    { en: "Rafah", coords: [31.2972, 34.2436] }
];

// ------------------------------------------
// Load weather data and add to cluster group
// ------------------------------------------
function loadWeatherWithClustering() {
    weatherCluster.clearLayers();

    weatherStations.forEach(station => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${station.en}&units=metric&lang=en&appid=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                if (data.cod !== 200) return;
                const temp = Math.round(data.main.temp);
                const marker = L.marker(station.coords).bindPopup(`
                    <div style="direction:ltr;text-align:center;width:220px;color:white;border-radius:18px;padding:15px;background:linear-gradient(135deg,#1976d2,#42a5f5);font-family:'Segoe UI',sans-serif;">
                        <h3 style="margin:0;">${station.en}</h3>
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" style="width:80px;height:80px;" alt="${data.weather[0].description}">
                        <div style="font-size:36px;font-weight:bold;margin-top:-10px;">${temp}°C</div>
                        <div style="font-size:14px;margin-bottom:10px;">${data.weather[0].description}</div>
                        <hr style="border:0;border-top:1px solid rgba(255,255,255,.4);">
                        <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:13px;">
                            <span>💧 ${data.main.humidity}%</span>
                            <span>💨 ${data.wind.speed} m/s</span>
                        </div>
                        <div style="margin-top:8px;font-size:13px;">🌡️ Feels like: ${Math.round(data.main.feels_like)}°C</div>
                    </div>
                `);
                weatherCluster.addLayer(marker);
            })
            .catch(err => console.error(`Error loading weather for ${station.en}:`, err));
    });
}

// Initial load and refresh every 10 minutes
loadWeatherWithClustering();
setInterval(loadWeatherWithClustering, 600000);