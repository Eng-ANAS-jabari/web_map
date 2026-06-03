// ==========================================
// main.js – Final initialization & shared utilities
// ==========================================

// ------------------------------------------
// Load Palestinian coordinate system (fallback)
// ------------------------------------------
(function loadProj4Fallback() {
    if (!window.proj4) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.11.0/proj4.js';
        script.onload = function() {
            proj4.defs(
                "EPSG:28191",
                "+proj=tmerc +lat_0=31.73409694444445 +lon_0=35.21208055555556 +k=1 +x_0=170251.555 +y_0=1126867.909 +ellps=clrk80 +towgs84=-275,-16,323,0,0,0,0 +units=m +no_defs"
            );
        };
        document.head.appendChild(script);
    } else {
        // Define system if library already loaded
        proj4.defs(
            "EPSG:28191",
            "+proj=tmerc +lat_0=31.73409694444445 +lon_0=35.21208055555556 +k=1 +x_0=170251.555 +y_0=1126867.909 +ellps=clrk80 +towgs84=-275,-16,323,0,0,0,0 +units=m +no_defs"
        );
    }
})();

// ------------------------------------------
// Dynamic watermark control class
// ------------------------------------------
const DynamicWatermark = L.Control.extend({
    options: {
        position: 'bottomleft',
        src: '',
        width: '100px',
        margin: '5px',
        marginBottom: '5px'
    },
    onAdd: function() {
        const img = L.DomUtil.create('img');
        img.src = this.options.src;
        img.style.width = this.options.width;
        img.style.margin = this.options.margin;
        if (this.options.marginBottom) {
            img.style.marginBottom = this.options.marginBottom;
        }
        return img;
    }
});

// ------------------------------------------
// Add watermarks to the map
// ------------------------------------------
new DynamicWatermark({ src: 'images/PPU_logo.png' }).addTo(map);
new DynamicWatermark({ src: 'images/leafleat_logo.png' }).addTo(map);
new DynamicWatermark({
    src: 'images/north.png',
    marginBottom: '255px'
}).addTo(map);

// ------------------------------------------
// Log successful initialization
// ------------------------------------------
console.log('✅ All map components loaded successfully');
console.log('   - map.js: Base map and layers');
console.log('   - activeCategories.js: Agricultural categories & legend');
console.log('   - weatherStations.js: Weather stations');
console.log('   - LocateControl.js: Coordinate display & geolocation');
console.log('   - main.js: Watermarks and final initialization');