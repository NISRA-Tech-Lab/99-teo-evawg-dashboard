import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createMaleFemaleLineChart, createBarChartData, createBarChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against women and men");
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons();
    let data = await readData("EXPVLADEQ");

    // Update values
    const stat = "Adult victims of gender-based violence";
    
    updateYearSpans(data, stat);

    insertValue("economic-female", data.data[stat][latest_year]["Economic violence"]["Sex - Female"]);
    insertValue("economic-male", data.data[stat][latest_year]["Economic violence"]["Sex - Male"]);

    insertValue("sexual-female", data.data[stat][latest_year]["Sexual violence"]["Sex - Female"]);
    insertValue("sexual-male", data.data[stat][latest_year]["Sexual violence"]["Sex - Male"]);

    insertValue("physical-female", data.data[stat][latest_year]["Physical violence"]["Sex - Female"]);
    insertValue("physical-male", data.data[stat][latest_year]["Physical violence"]["Sex - Male"]);

    insertValue("psychological-female", data.data[stat][latest_year]["Psychological violence"]["Sex - Female"]);
    insertValue("psychological-male", data.data[stat][latest_year]["Psychological violence"]["Sex - Male"]);

    insertValue("online-female", data.data[stat][latest_year]["Online violence"]["Sex - Female"]);
    insertValue("online-male", data.data[stat][latest_year]["Online violence"]["Sex - Male"]);


    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "Other types of violence")

    const chart_data = createBarChartData({data, stat, year: latest_year, violence_types});

    createBarChart({
        chart_data,
        categories: violence_types,
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