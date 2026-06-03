// ==========================================
// map.js – Global variables and base map setup
// ==========================================

// Globals used by other modules
let geoJsonLayer;
let legendControl;

// Create the main map object
const map = L.map('map').setView([31.506508, 35.090727], 8);

// ------------------------------------------
// Base tile layer (OpenStreetMap HOT)
// ------------------------------------------
const openStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors, HOT'
}).addTo(map);

// ------------------------------------------
// Esri dynamic map layers
// ------------------------------------------
const ortho2023 = L.esri.dynamicMapLayer({
    url: 'https://orthophotos.geomolg.ps/adaptor/rest/services/Orthophotos_WB_2023_15cm_jp2_PG1923_jp2/MapServer',
    opacity: 1,
    format: 'png24',
    transparent: true,
    useCors: false
});

const ortho2024 = L.esri.dynamicMapLayer({
    url: 'https://orthophotos.geomolg.ps/adaptor/rest/services/Orthophotos_GS_2024_m12_Satellite_tif_PG1923/MapServer',
    opacity: 1,
    format: 'png24',
    transparent: true,
    useCors: false
});

const GovernoratesLandBoundary = L.esri.dynamicMapLayer({
    url: 'https://orthophotos.geomolg.ps/adaptor/rest/services/GovernoratesLandBoundary_02/MapServer',
    opacity: 1,
    transparent: true,
    useCors: false
});

// ------------------------------------------
// Layer groups
// ------------------------------------------
const jsonLayerGroup = L.layerGroup().addTo(map);

// Weather stations cluster group
const weatherCluster = L.markerClusterGroup({
    maxClusterRadius: 70,
    disableClusteringAtZoom: 12,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        let bgColor = count > 20 ? '#d32f2f' : (count > 10 ? '#f57c00' : '#1976d2');
        return L.divIcon({
            html: `<div style="background:${bgColor}; color:white; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; font-weight:bold; border:2px solid white; box-shadow:0 0 5px rgba(0,0,0,0.5); font-size:${count > 99 ? '12px' : '16px'}">${count}</div>`,
            className: 'custom-cluster-icon',
            iconSize: L.point(40, 40)
        });
    }
}).addTo(map);

// ------------------------------------------
// Layer control
// ------------------------------------------
L.control.layers(
    { "OpenStreetMap HOT": openStreetMap_HOT },
    {
        "Orthophoto 2023": ortho2023,
        "Orthophoto 2024": ortho2024,
        "Agricultural Lands (JSON)": jsonLayerGroup,
        "Governorate Boundaries": GovernoratesLandBoundary
    },
    { collapsed: false }
).addTo(map);