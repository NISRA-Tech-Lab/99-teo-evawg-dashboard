import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createMaleFemaleLineChart, createViolenceTypeBarChart } from "./utils/charts.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against women and men");
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons("prevalence-violence-nilt");
    let data = await readData("EXPVLADEQ");

    // Update values

    const stat = "Adult victims of gender-based violence";

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

    document.getElementById("economic-female").textContent = data.data[stat][latest_year][`Economic violence`][`Sex - Female`];
    document.getElementById("economic-male").textContent = data.data[stat][latest_year][`Economic violence`][`Sex - Male`];
    document.getElementById("sexual-female").textContent = data.data[stat][latest_year][`Sexual violence`][`Sex - Female`];
    document.getElementById("sexual-male").textContent = data.data[stat][latest_year][`Sexual violence`][`Sex - Male`];
    document.getElementById("physical-female").textContent = data.data[stat][latest_year][`Physical violence`][`Sex - Female`];
    document.getElementById("physical-male").textContent = data.data[stat][latest_year][`Physical violence`][`Sex - Male`];
    document.getElementById("psychological-female").textContent = data.data[stat][latest_year][`Psychological violence`][`Sex - Female`];
    document.getElementById("psychological-male").textContent = data.data[stat][latest_year][`Psychological violence`][`Sex - Male`];
    document.getElementById("online-female").textContent = data.data[stat][latest_year][`Online violence`][`Sex - Female`];
    document.getElementById("online-male").textContent = data.data[stat][latest_year][`Online violence`][`Sex - Male`];

    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "Other types of violence")

    createViolenceTypeBarChart({
        data,
        stat,
        year: latest_year,
        violence_types,
        canvas_id: "prevalence-nilt-bar",
        label_format: "%"
    });

    // Create line chart
    createMaleFemaleLineChart({
            data,
            stat,
            years,
            female_selection: ["Physical violence", "Sex - Female"],
            male_selection: ["Physical violence", "Sex - Male"],
            canvas_id: "prevalence-nilt-line"
        });    

})