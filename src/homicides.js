import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { maleComparison } from "./utils/male-comparison.js";
import { readData } from "./utils/read-data.js";
import { createMaleFemaleLineChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Homicides");
    insertHeader();
    insertFooter();
    insertNavButtons();
    maleComparison();
    let data = await readData("PRCHOM");

    // Update values
    const stat = "All homicides";

    updateYearSpans(data, stat);

    insertValue("homicide-box1-female", data.data[stat][latest_year]["18+ years"]["Female"]);
    insertValue("homicide-box1-male", data.data[stat][latest_year]["18+ years"]["Male"]);
    insertValue("homicide-box2-female", data.data[stat][latest_year]["18+ years"]["Female"]);
    insertValue("homicide-box2-male", data.data[stat][latest_year]["18+ years"]["Male"]);
    insertValue("homicide-box3-girl", data.data[stat][latest_year]["Under 18 years"]["Female"]);
    insertValue("homicide-box3-boy", data.data[stat][latest_year]["Under 18 years"]["Male"]);
    
    // Create line chart
        createMaleFemaleLineChart({
        data,
        stat,
        years,
        female_selection: ["Under 18 years", "Female"],
        male_selection: ["Under 18 years", "Male"],
        canvas_id: "under-18-homicide-line"
    });

    createMaleFemaleLineChart({
        data,
        stat,
        years,
        female_selection: ["18+ years", "Female"],
        male_selection: ["18+ years", "Male"],
        canvas_id: "18-plus-homicide-line"
    });
    
})