import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createMaleFemaleLineChart, createViolenceTypeBarChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against girls and boys");
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons("prevalence-violence-ylt");
    let data = await readData("EXPVLYTHEQ");

    // Update values

    const stat = "Victims of gender-based violence";

    updateYearSpans(data, stat);

    document.getElementById("violence-girl").textContent = 100 - data.data[stat][latest_year]['No violence']['Gender - Female'];
    document.getElementById("violence-boy").textContent  = 100 - data.data[stat][latest_year]['No violence']['Gender - Male'];
    document.getElementById("online-girl").textContent = data.data[stat][latest_year][`Online violence`][`Gender - Female`];
    document.getElementById("online-boy").textContent = data.data[stat][latest_year][`Online violence`][`Gender - Male`];
    document.getElementById("sexual-girl").textContent = data.data[stat][latest_year][`Sexual violence`][`Gender - Female`];
    document.getElementById("sexual-boy").textContent = data.data[stat][latest_year][`Sexual violence`][`Gender - Male`];
    document.getElementById("psychological-girl").textContent = data.data[stat][latest_year][`Psychological violence`][`Gender - Female`];
    document.getElementById("psychological-boy").textContent = data.data[stat][latest_year][`Psychological violence`][`Gender - Male`];
    document.getElementById("physical-girl").textContent = data.data[stat][latest_year][`Physical violence`][`Gender - Female`];
    document.getElementById("physical-boy").textContent = data.data[stat][latest_year][`Physical violence`][`Gender - Male`];

    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "No violence");

    createViolenceTypeBarChart({
        data,
        stat,
        year: latest_year,
        violence_types,
        canvas_id: "prevalence-ylt-bar",
        label_format: "%"
    });

    // Create line chart
    createMaleFemaleLineChart({
            data,
            stat,
            years,
            female_selection: ["No violence", "Gender - Female"],
            male_selection: ["No violence", "Gender - Male"],
            canvas_id: "prevalence-ylt-line"
        });



})