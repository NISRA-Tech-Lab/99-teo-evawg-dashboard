import { insertHeader, insertFooter, insertNavButtons } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"

window.addEventListener("DOMContentLoaded", async () => {

    insertHeader();
    insertFooter();
    insertNavButtons("prevalence-violence-nilt");
    let data = await readData("EXPVLADEQ");

    console.log(data)

    // Create table
    const table = document.getElementById("prevalence-violence-nilt-table");

    const stat = "Adult victims of gender-based violence";

    const years = Object.keys(data.data[stat]);
    const latest_year = years[years.length - 1];

    const year_spans = document.getElementsByClassName("latest-year");
    for (let i = 0; i < year_spans.length; i ++) {
        year_spans[i].textContent = latest_year;
    }

    let tr = document.createElement("tr");
    
    const headings = ["", "Female", "Male", "NI"];
    for (let i = 0; i < headings.length; i ++) {
        let th = document.createElement("th");
        th.textContent = headings[i];
        th.style.textAlign = "right";
        tr.appendChild(th);
    }

    table.appendChild(tr);

    const rows = ["Online", "Economic", "Sexual", "Physical", "Physchological"];
    for (let i = 0; i < rows.length; i ++) {
        tr = document.createElement("tr");

        let row_name = document.createElement("td");
        row_name.textContent = rows[i];
        tr.appendChild(row_name);

        let female = document.createElement("td");
        female.textContent = data.data[stat][latest_year][`${rows[i]} violence`][`Gender - Female`];
        female.style.textAlign = "right";
        tr.appendChild(female);

        let male = document.createElement("td");
        male.textContent = data.data[stat][latest_year][`${rows[i]} violence`][`Gender - Male`];
        male.style.textAlign = "right";
        tr.appendChild(male);

        let ni = document.createElement("td");
        ni.textContent = data.data[stat][latest_year][`${rows[i]} violence`][`All respondents`];
        ni.style.textAlign = "right";
        tr.appendChild(ni);

        table.appendChild(tr);
    }

    // Create bar chart
    

    

})