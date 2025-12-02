import { loadShapes } from "./load-shapes.js";

let map;               // cache map between calls
let geojsonData;       // cache shapes between calls

export async function plotMap(data, stat, latest_year, crimeType) {

  document.getElementById("map-title").innerText =
    `Police recorded crime - ${crimeType} by Local Government District, ${latest_year}`;

  const lgds = Object.keys(data.data[stat][latest_year])
        .filter(lgd => lgd !== "Northern Ireland");

  // --- build values array based on selected crime type ---
  const values = lgds.map(lgd => 
      data.data[stat][latest_year][lgd][crimeType]
  );

  // --- ranges & normalized colours ---
  let range_min = Math.floor(Math.min(...values.filter(v => v != null)));
  let range_max = Math.ceil(Math.max(...values.filter(v => v != null)));

  updateLegend(range_min, range_max, "Crimes recorded");

  const range = range_max - range_min || 1;

  let colours = values.map(v => 
      v == null ? -1 : (v - range_min) / range
  );

  // --- load shapes once ---
  if (!geojsonData) geojsonData = await loadShapes();

  // --- prepare styled geojson (same logic as you already had) ---
  const features = geojsonData.features.map((f, idx) => {
      const codeProp = "LGDNAME";
      const code = String(f.properties[codeProp]);
      const geogIndex = lgds.indexOf(code);

      const rawValue = values[geogIndex];
      const label = code;

      const fillHex =
        rawValue == null
          ? "#eeeeee"
          : getColour(colours[geogIndex]);

      return {
        ...f,
        id: idx,
        properties: {
          ...f.properties,
          nisra_code: code,
          nisra_value: rawValue,
          nisra_label: label,
          nisra_year: latest_year,
          nisra_fill: fillHex,
          nisra_hasValue: rawValue !== null && rawValue !== undefined
        }
      };
  });

  const styledGeojson = { ...geojsonData, features };

  // =========================================================
  // If map already exists, just update the source and return
  // =========================================================
  if (map && map.getSource("shapes")) {
      map.getSource("shapes").setData(styledGeojson);
      return;
  }

  // =========================================================
  // Otherwise, create map once, add layers, events, etc.
  // =========================================================
  let initial_zoom = 1;
  let bounds = [[-9.3, 53.58], [-4.3, 55.72]];

  map = new maplibregl.Map({
      container: 'map-container',
      style: 'public/map/style-omt.json',
      center: [-6.85, 54.67],
      zoom: initial_zoom,
      minZoom: initial_zoom,
      maxZoom: initial_zoom + 7,
      maxBounds: bounds,
      attributionControl: false
  });

  map.addControl(
    new maplibregl.NavigationControl({
        showZoom: true,
        showCompass: false,
        visualizePitch: false
    }),
    'top-right'
  );

  map.on("load", () => {

    map.addSource('shapes', {
        type: 'geojson',
        data: styledGeojson,
        generateId: true
    });

    map.addLayer({
        id: 'shapes-fill',
        type: 'fill',
        source: 'shapes',
        paint: {
          'fill-color': [
              'case',
              ['boolean', ['get', 'nisra_hasValue'], false],
              ['get', 'nisra_fill'],
              '#eeeeee'
          ],
          'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.8,
              0.7
          ]
        }
    });

    map.addLayer({
        id: 'shapes-outline',
        type: 'line',
        source: 'shapes',
        paint: {
          'line-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#222222',
              '#555555'
          ],
          'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              2,
              1
          ],
          'line-opacity': 0.9
        }
    });

    // --- hover interactivity (unchanged) ---
    let hoveredId = null;
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -6],
        className: 'nisra-popup'
    });

    map.on('mousemove', 'shapes-fill', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const f = e.features && e.features[0];
        if (!f) return;

        if (hoveredId !== null) {
          map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: false });
        }
        hoveredId = f.id;
        map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: true });

        const p = f.properties;
        const valueStr = (p.nisra_value == null)
          ? 'Not available'
          : Number(p.nisra_value).toLocaleString('en-GB');

        const html = `
          <div>
            <strong>${p.nisra_label}</strong> (${p.nisra_year}): 
            <strong>${valueStr}</strong>
          </div>
        `.trim();

        popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
    });

    map.on('mouseleave', 'shapes-fill', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredId !== null) {
          map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: false });
          hoveredId = null;
        }
        popup.remove();
    });

  });
}

export function getColour(normOrBin) {
    if (normOrBin == null || normOrBin < 0) return "#d3d3d3";
    const idx = Math.max(0, Math.min(4, Math.round(normOrBin * 4)));
    return palette[idx];
}

export const palette = ["#d6e4f6", "#8db2e0", "#3878c5", "#22589c", "#00205b"];


function updateLegend(range_min, range_max, unitLabel = "") {
  const legendEl = document.getElementById("map-legend");
  if (!legendEl) return;

  const minStr =
    (range_min == null || isNaN(range_min)) ? "n/a"
    : Number(range_min).toLocaleString("en-GB");

  const maxStr =
    (range_max == null || isNaN(range_max)) ? "n/a"
    : Number(range_max).toLocaleString("en-GB");

  legendEl.classList.add("map-legend");

  legendEl.innerHTML = `
    <div class="d-flex w-100">
      <div class="legend-min">${minStr}</div>
      <div class="legend-unit">${unitLabel}</div>
      <div class="legend-max">${maxStr}</div>
    </div>

    <div class="d-flex w-100">
      ${palette.map(c => `
        <div class="colour-block" style="background:${c}"></div>
      `).join("")}
    </div>
  `;

}
