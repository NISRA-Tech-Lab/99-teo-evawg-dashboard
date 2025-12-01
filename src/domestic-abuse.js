import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createMaleFemaleLineChart, createViolenceTypeBarChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Domestic abuse")
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons("domestic-abuse");
    let data = await readData("EXPDA");

     // Update values
    const stat = "Victims of domestic abuse";

    updateYearSpans(data, stat);

    insertValue("lifetime-female", data.data[stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Female"]);
    insertValue("lifetime-male",   data.data[stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Male"]);

    insertValue("three-year-female", data.data[stat][latest_year]["Any domestic abuse"]["Recent (last 3 years)"]["Female"]);
    insertValue("three-year-male",   data.data[stat][latest_year]["Any domestic abuse"]["Recent (last 3 years)"]["Male"]);

    insertValue("non-physical-female", data.data[stat][latest_year]["Non-physical abuse"]["Lifetime (since age 16)"]["Female"]);
    insertValue("non-physical-male",   data.data[stat][latest_year]["Non-physical abuse"]["Lifetime (since age 16)"]["Male"]);

    insertValue("threats-female", data.data[stat][latest_year]["Threats"]["Lifetime (since age 16)"]["Female"]);
    insertValue("threats-male",   data.data[stat][latest_year]["Threats"]["Lifetime (since age 16)"]["Male"]);

    insertValue("force-female", data.data[stat][latest_year]["Force"]["Lifetime (since age 16)"]["Female"]);
    insertValue("force-male",   data.data[stat][latest_year]["Force"]["Lifetime (since age 16)"]["Male"]);



})