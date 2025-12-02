import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js";
import { plotMap } from "./utils/plot-map.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Maps");
    insertHeader();
    insertFooter();
    insertNavButtons();
    const data = await readData("PRCPD");

    let stat = "All crimes recorded by the police";
    const years = Object.keys(data.data[stat]);
    const latest_year = years[years.length - 1];

    const crime_filter = document.getElementById("crime-filter");
    let crime_type = crime_filter.value;

    // first draw
    plotMap(data, stat, latest_year, crime_type);

    // redraw when filter changes
    crime_filter.addEventListener("change", (e) => {
        crime_type = e.target.value;
        plotMap(data, stat, latest_year, crime_type);
    });

});