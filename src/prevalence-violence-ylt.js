import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createMaleFemaleLineChart, createViolenceTypeBarChart } from "./utils/charts.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against girls and boys");
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons("prevalence-violence-ylt");
    let data = await readData("EXPVLYTHEQ");

    // Update values

    const stat = "Victims of gender-based violence";

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

    const no_violence_girl = data.data[stat][latest_year]['No violence']['Gender - Female'];
    const no_violence_boy   = data.data[stat][latest_year]['No violence']['Gender - Male'];

    const violence_girl = 100 - Number(no_violence_girl);
    const violence_boy   = 100 - Number(no_violence_boy);

    document.getElementById("violence-girl").textContent = violence_girl;
    document.getElementById("violence-boy").textContent  = violence_boy;
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