import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Domestic abuse")
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons("prevalence-of-domestic-abuse");
    let data = await readData("EXPDA");

     // Update values

    const stat = "Victims of domestic abuse";

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

document.getElementById("lifetime-female").textContent = data.data[stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Female"];
document.getElementById("lifetime-male").textContent = data.data[stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Male"];
document.getElementById("three-year-female").textContent = data.data[stat][latest_year]["Any domestic abuse"]["Recent (last 3 years)"]["Female"];
document.getElementById("three-year-male").textContent = data.data[stat][latest_year]["Any domestic abuse"]["Recent (last 3 years)"]["Male"];
document.getElementById("non-physical-female").textContent = data.data[stat][latest_year]["Non-physical abuse"]["Lifetime (since age 16)"]["Female"];
document.getElementById("non-physical-male").textContent = data.data[stat][latest_year]["Non-physical abuse"]["Lifetime (since age 16)"]["Male"];
document.getElementById("threats-female").textContent = data.data[stat][latest_year]["Threats"]["Lifetime (since age 16)"]["Female"];
document.getElementById("threats-male").textContent = data.data[stat][latest_year]["Threats"]["Lifetime (since age 16)"]["Male"];
document.getElementById("force-female").textContent = data.data[stat][latest_year]["Force"]["Lifetime (since age 16)"]["Female"];
document.getElementById("force-male").textContent = data.data[stat][latest_year]["Force"]["Lifetime (since age 16)"]["Male"];


})