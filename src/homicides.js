import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { maleComparison } from "./utils/male-comparison.js";
import { readData } from "./utils/read-data.js";
import { createMaleFemaleLineChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Homicides");
    insertHeader();
    insertFooter();
    insertNavButtons("homicides");
    maleComparison();
    let data = await readData("PRCHOM");

    // Update values
    const stat = "All homicides";

    updateYearSpans(data, stat);
    
    // Create line chart
    createMaleFemaleLineChart({
        data,
        stat,
        years,
        female_selection: ["18+ years", "Female"],
        male_selection: ["18+ years", "Male"],
        canvas_id: "18-plus-homicide-line"
    });
    
})