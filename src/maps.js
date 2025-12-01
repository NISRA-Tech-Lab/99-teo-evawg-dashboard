import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js";
import { loadShapes } from "./utils/load-shapes.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Maps");
    insertHeader();
    insertFooter();
    insertNavButtons("maps");
    const data = await readData("PRCPD");

    let stat = "All crimes recorded by the police";
    const years = Object.keys(data.data[stat]);
    const latest_year = years[years.length - 1];

    const lgds = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "Northern Ireland");

    
    let sexual_offences_figs = [];
    let stalking_figs = [];
    let violence_figs = [];
    for (let i = 0; i < lgds.length; i++) {
        sexual_offences_figs.push(data.data[stat][latest_year][lgds[i]]["Sexual offences (Total)"]);
        stalking_figs.push(data.data[stat][latest_year][lgds[i]]["Stalking & harassment"]);
        violence_figs.push(data.data[stat][latest_year][lgds[i]]["Violence against the person (Total)"]);
    }

    // Map code
    let initial_zoom = window.innerWidth < 768 ? 6 : 7; 
    let bounds = [[-9.20, 53.58], [-4.53, 55.72]];

     // Create a map
       const map = new maplibregl.Map({
            container: 'map-container',
            style: 'public/map/style-omt.json',
            center: [-6.85, 54.67],
            zoom: initial_zoom,
            minZoom: initial_zoom,
            maxZoom: initial_zoom + 7,
            maxBounds: bounds,
            attributionControl: false
        }); 

    // After creating `map`
    map.addControl(
    new maplibregl.NavigationControl({
        showZoom: true,     // +/− buttons
        showCompass: false, // hide rotate/compass
        visualizePitch: false
    }),
    'top-right'           // positions: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    );

    const geojsonData = await loadShapes();
    

});