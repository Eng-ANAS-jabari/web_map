// ==========================================
// activeCategories.js – Agricultural categories & legend
// ==========================================

// Toggle state for agricultural classification filters
const activeCategories = {
    'Agricultural lands in Gaza Strip': true,
    'High agricultural value': true,
    'Forests / National parks': true,
    'Medium agricultural value': true,
    'Low agricultural value': true
};

// ------------------------------------------
// Color and style functions for agricultural polygons
// ------------------------------------------
function getColor(classifica) {
    const colors = {
        'Agricultural lands in Gaza Strip': '#bcf153',
        'High agricultural value': '#31a354',
        'Forests / National parks': '#74c476',
        'Medium agricultural value': '#a1d99b',
        'Low agricultural value': '#c7e9c0'
    };
    return colors[classifica] || '#969696';
}

function styleAgricultural(feature) {
    return {
        fillColor: getColor(feature.properties?.classifica),
        weight: 1.5,
        opacity: 0.8,
        color: '#232323',
        fillOpacity: 0.65
    };
}

// ------------------------------------------
// Fetch and display agricultural land data
// ------------------------------------------
fetch('./New Folder/agricultural.json')
    .then(res => {
        if (!res.ok) throw new Error('agricultural.json file not found');
        return res.json();
    })
    .then(data => {
        geoJsonLayer = L.geoJSON(data, {
            style: styleAgricultural,
            onEachFeature: (feature, layer) => {
                if (feature.properties?.classifica) {
                    layer.bindPopup(`
                        <div style="direction: ltr; text-align: left; font-family: sans-serif;">
                            <h4 style="margin: 0 0 5px 0; color: #31a354;">Feature Details</h4>
                            <b>Agricultural Classification:</b> ${feature.properties.classifica}
                        </div>
                    `);
                }
            }
        });
        jsonLayerGroup.addLayer(geoJsonLayer);
        updateLayerVisibility();
        if (geoJsonLayer.getLayers().length > 0) {
            map.fitBounds(geoJsonLayer.getBounds());
        }
    })
    .catch(err => console.error('Error loading agricultural data:', err));

// ------------------------------------------
// Update layer visibility based on active categories
// ------------------------------------------
function updateLayerVisibility() {
    if (!geoJsonLayer) return;
    geoJsonLayer.eachLayer(layer => {
        const cat = layer.feature?.properties?.classifica;
        if (cat) {
            layer.setStyle(
                activeCategories[cat] !== false
                    ? styleAgricultural(layer.feature)
                    : { fillOpacity: 0, opacity: 0, weight: 0 }
            );
        }
    });
}

// ------------------------------------------
// Dynamic legend control
// ------------------------------------------
legendControl = L.control({ position: 'bottomright' });

legendControl.onAdd = function() {
    const div = L.DomUtil.create('div', 'custom-legend');
    refreshLegendContent(div);
    return div;
};

function refreshLegendContent(container) {
    const div = container || document.querySelector('.custom-legend');
    if (!div) return;

    const layersState = [
        {
            has: map.hasLayer(ortho2023),
            html: `<div class="overlay-section"><div class="overlay-title"><span class="overlay-icon icon-ortho"></span> Orthophoto 2023</div></div>`
        },
        {
            has: map.hasLayer(ortho2024),
            html: `<div class="overlay-section"><div class="overlay-title"><span class="overlay-icon icon-ortho"></span> Orthophoto 2024</div></div>`
        },
        {
            has: map.hasLayer(GovernoratesLandBoundary),
            html: `<div class="overlay-section"><div class="overlay-title"><span class="overlay-icon icon-boundary"></span> Governorate Boundaries</div></div>`
        },
        {
            has: map.hasLayer(weatherCluster),
            html: `<div class="overlay-section"><div class="overlay-title"><span class="overlay-icon icon-weather"></span> Current Weather Stations</div></div>`
        }
    ];

    let html = '<div class="legend-header">Visible Layers</div>';
    let anyVisible = false;

    layersState.forEach(l => {
        if (l.has) {
            html += l.html;
            anyVisible = true;
        }
    });

    if (map.hasLayer(jsonLayerGroup)) {
        anyVisible = true;
        html += `<div class="overlay-section"><div class="overlay-title"><span class="overlay-icon icon-agri-group"></span> Agricultural Lands</div><div class="agri-categories">`;
        Object.keys(activeCategories).forEach(cat => {
            html += `
                <div class="legend-item ${activeCategories[cat] ? '' : 'inactive'}" data-category="${cat}">
                    <i class="legend-color-badge" style="background: ${getColor(cat)}"></i>
                    <span class="legend-text">${cat}</span>
                </div>`;
        });
        html += `</div></div>`;
    }

    div.innerHTML = anyVisible ? html : '<div class="no-layers">No layers currently visible</div>';

    // Attach click listeners for filtering
    if (map.hasLayer(jsonLayerGroup)) {
        div.querySelectorAll('.legend-item[data-category]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const cat = this.dataset.category;
                activeCategories[cat] = !activeCategories[cat];
                this.classList.toggle('inactive', !activeCategories[cat]);
                updateLayerVisibility();
            });
        });
    }
}

legendControl.addTo(map);

// Refresh legend whenever an overlay is added/removed
map.on('overlayadd overlayremove', () => {
    requestAnimationFrame(() => refreshLegendContent());
});