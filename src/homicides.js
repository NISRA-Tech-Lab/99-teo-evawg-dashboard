import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { maleComparison } from "./utils/male-comparison.js";
import { readData } from "./utils/read-data.js";
import { createMaleFemaleLineChart, createBarChartData, createBarChart  } from "./utils/charts.js";
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

    // Create bar chart
    const age_groups = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "All ages");

    const chart_data = createBarChartData({data, stat, year: latest_year, categories: age_groups});
    
    createBarChart({
        chart_data,
        categories: age_groups,
        canvas_id: "homicide-bar",
    });
    
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