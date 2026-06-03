// ==========================================
// LocateControl.js – Coordinates box & geolocation
// ==========================================

// ------------------------------------------
// Palestinian Grid (PG1923) coordinates display
// ------------------------------------------
const CoordinatesControl = L.Control.extend({
    onAdd: function() {
        this._div = L.DomUtil.create('div', 'leaflet-coordinates-box');
        this.updateText(0, 0);
        return this._div;
    },
    updateText: function(east, north) {
        this._div.innerHTML = `
            <div class="coordinates-title">Palestinian Grid (PG1923)</div>
            <div>East (E): <span class="coordinates-value">${east}</span> m</div>
            <div>North (N): <span class="coordinates-value">${north}</span> m</div>
        `;
    }
});

const coordControl = new CoordinatesControl({ position: 'topleft' }).addTo(map);

// Update coordinates on mouse move
map.on('mousemove', function(e) {
    if (!window.proj4) return;
    try {
        const palestineCoords = proj4("WGS84", "EPSG:28191", [e.latlng.lng, e.latlng.lat]);
        coordControl.updateText(
            palestineCoords[0].toFixed(2),
            palestineCoords[1].toFixed(2)
        );
    } catch (err) {
        coordControl.updateText("Out of range", "Out of range");
    }
});

// ------------------------------------------
// Custom red marker icon (pin)
// ------------------------------------------
const redMarkerIcon = L.divIcon({
    html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d32f2f" width="36px" height="36px">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>`,
    className: 'custom-red-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
});

// ------------------------------------------
// Locate button (geolocation)
// ------------------------------------------
const LocateControl = L.Control.extend({
    onAdd: function(map) {
        const btn = L.DomUtil.create('div', 'leaflet-custom-locate-btn');
        btn.innerHTML = '🎯';
        btn.title = 'Locate my current position';
        L.DomEvent.disableClickPropagation(btn);
        btn.addEventListener('click', () => {
            map.locate({ enableHighAccuracy: true });
        });
        return btn;
    }
});

new LocateControl({ position: 'topleft' }).addTo(map);

// ------------------------------------------
// Handle geolocation events
// ------------------------------------------
map.on('locationfound', function(e) {
    const latGeo = e.latlng.lat.toFixed(6);
    const lngGeo = e.latlng.lng.toFixed(6);
    let alertMessage = `Your location has been successfully identified! Navigating now...\n\n📍 Geographic Coordinates:\nLat: ${latGeo}\nLng: ${lngGeo}`;

    if (window.proj4) {
        try {
            const palCoords = proj4("WGS84", "EPSG:28191", [e.latlng.lng, e.latlng.lat]);
            alertMessage += `\n\n🇵🇸 Palestinian Grid (PG1923):\nE: ${palCoords[0].toFixed(2)} m\nN: ${palCoords[1].toFixed(2)} m`;
        } catch (err) {
            console.error('Coordinate conversion error:', err);
        }
    }

    alert(alertMessage);
    map.flyTo(e.latlng, 16);

    L.marker(e.latlng, { icon: redMarkerIcon })
        .addTo(map)
        .bindPopup(`
            <div style="direction: ltr; text-align: center; font-family: sans-serif; font-size: 13px;">
                <b style="color: #d32f2f;">You are here now 📍</b><br>
                <span style="font-family: monospace; font-size:11px;">${latGeo}, ${lngGeo}</span>
            </div>
        `)
        .openPopup();
});

map.on('locationerror', function(e) {
    alert("Location detection failed: " + e.message + "\nPlease make sure GPS is enabled and the browser has permission to access your location.");
});