import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { maleComparison } from "./utils/male-comparison.js";
import { readData } from "./utils/read-data.js";
import { createMaleFemaleLineChart } from "./utils/male-female-line.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Homicides");
    insertHeader();
    insertFooter();
    insertNavButtons("homicides");
    maleComparison();
    let data = await readData("PRCHOM");

    // Update values
    const stat = "All homicides";

    const years = Object.keys(data.data[stat]);
    const first_year = years[0];
    const latest_year = years[years.length - 1];

    const first_year_spans = document.getElementsByClassName("first-year");
     for (let i = 0; i < first_year_spans.length; i ++) {
        first_year_spans[i].textContent = first_year;
    }

    const year_spans = document.getElementsByClassName("latest-year");
    for (let i = 0; i < year_spans.length; i ++) {
        year_spans[i].textContent = latest_year;
    }
    
    // Create line chart
    createMaleFemaleLineChart({
        data,
        stat,
        years,
        female_selection: ["All ages", "Female"],
        male_selection: ["All ages", "Male"],
        canvas_id: "homicide-line"
    });
    
})