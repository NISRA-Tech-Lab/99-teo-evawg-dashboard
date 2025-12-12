import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js";
import { createLineChart, createBarChartData, createBarChart  } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Case processing times")
    insertHeader();
    insertFooter();
    insertNavButtons();
    let data = await readData("INDPRCASEEQ");

        // Update values
    const stat = "Average time taken to complete criminal cases";

    updateYearSpans(data, stat);

    insertValue("sexual-case-processing", data.data[stat][latest_year]["Offence category - Sexual"]);
    insertValue("all-case-processing", data.data[stat][latest_year]["Northern Ireland"]);


    // Create line chart
    createLineChart({
        data,
        stat,
        years,
        line_1: ["Northern Ireland"],
        line_2: ["Offence category - Sexual"],
        label_1: "All offences",
        label_2: "Sexual offences",
        canvas_id: "case-processing-sexual-line",
    });

})