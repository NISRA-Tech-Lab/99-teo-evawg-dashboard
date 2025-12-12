import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createLineChart, createBarChart, createBarChartData } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against girls and boys");
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons();
    let data = await readData("EXPVLYTHEQ");

    // Update values

    const stat = "Victims of gender-based violence";

    updateYearSpans(data, stat);

    insertValue("violence-girl", 100 - data.data[stat][latest_year]["No violence"]["Gender - Female"]);
    insertValue("violence-boy",  100 - data.data[stat][latest_year]["No violence"]["Gender - Male"]);

    insertValue("online-girl", data.data[stat][latest_year]["Online violence"]["Gender - Female"]);
    insertValue("online-boy",  data.data[stat][latest_year]["Online violence"]["Gender - Male"]);

    insertValue("sexual-girl", data.data[stat][latest_year]["Sexual violence"]["Gender - Female"]);
    insertValue("sexual-boy",  data.data[stat][latest_year]["Sexual violence"]["Gender - Male"]);

    insertValue("psychological-girl", data.data[stat][latest_year]["Psychological violence"]["Gender - Female"]);
    insertValue("psychological-boy",  data.data[stat][latest_year]["Psychological violence"]["Gender - Male"]);

    insertValue("physical-girl", data.data[stat][latest_year]["Physical violence"]["Gender - Female"]);
    insertValue("physical-boy",  data.data[stat][latest_year]["Physical violence"]["Gender - Male"]);

    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "No violence");

    const chart_data = createBarChartData({data, stat, year: latest_year, categories: violence_types});
    
    createBarChart({
        chart_data,
        categories: violence_types,
        canvas_id: "prevalence-ylt-bar",
        label_format: "%"
    });

    // Create line chart
    createLineChart({
            data,
            stat,
            years,
            line_1: ["No violence", "Gender - Female"],
            line_2: ["No violence", "Gender - Male"],
            canvas_id: "prevalence-ylt-line"
        });



})