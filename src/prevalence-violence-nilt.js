import { insertHeader, insertFooter, insertNavButtons } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"

window.addEventListener("DOMContentLoaded", async () => {

    insertHeader();
    insertFooter();
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

    document.getElementById("economic-female").textContent = data.data[stat][latest_year][`Economic violence`][`Gender - Female`];
    document.getElementById("economic-male").textContent = data.data[stat][latest_year][`Economic violence`][`Gender - Male`];
    document.getElementById("sexual-female").textContent = data.data[stat][latest_year][`Sexual violence`][`Gender - Female`];
    document.getElementById("sexual-male").textContent = data.data[stat][latest_year][`Sexual violence`][`Gender - Male`];
    document.getElementById("physical-female").textContent = data.data[stat][latest_year][`Physical violence`][`Gender - Female`];
    document.getElementById("physical-male").textContent = data.data[stat][latest_year][`Physical violence`][`Gender - Male`];
    document.getElementById("psychological-female").textContent = data.data[stat][latest_year][`Physchological violence`][`Gender - Female`];
    document.getElementById("psychological-male").textContent = data.data[stat][latest_year][`Physchological violence`][`Gender - Male`];
    
    // Create table
    const table = document.getElementById("prevalence-violence-nilt-table");
    let tr = document.createElement("tr");
    
    const headings = ["", "Female", "Male", "NI"];
    for (let i = 0; i < headings.length; i ++) {
        let th = document.createElement("th");
        th.textContent = headings[i];
        th.style.textAlign = "right";
        tr.appendChild(th);
    }

    table.appendChild(tr);

    const violence_types = ["Online", "Economic", "Sexual", "Physical", "Physchological"];
    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < violence_types.length; i ++) {
        tr = document.createElement("tr");

        let row_name = document.createElement("td");
        row_name.textContent = violence_types[i];
        tr.appendChild(row_name);

        female_bars.push(data.data[stat][latest_year][`${violence_types[i]} violence`][`Gender - Female`]);
        let female = document.createElement("td");
        female.textContent = female_bars[i];
        female.style.textAlign = "right";
        tr.appendChild(female);

        male_bars.push(data.data[stat][latest_year][`${violence_types[i]} violence`][`Gender - Male`]);
        let male = document.createElement("td");
        male.textContent = male_bars[i];
        male.style.textAlign = "right";
        tr.appendChild(male);

        let ni = document.createElement("td");
        ni.textContent = data.data[stat][latest_year][`${violence_types[i]} violence`][`All respondents`];
        ni.style.textAlign = "right";
        tr.appendChild(ni);

        table.appendChild(tr);
    }    

    // Create bar chart
    const bar_canvas = document.getElementById("prevalence-nilt-bar");

    const bar_data = {
        labels: violence_types,
        datasets: [{
            axis: 'y',
            label: 'Females (%)',
            data: female_bars,
            fill: false,
            backgroundColor: '#893B67',
            borderWidth: 1
        },
        {
            axis: 'y',
            label: 'Males (%)',
            data: male_bars,
            fill: false,
            backgroundColor: '#4E95D9',
            borderWidth: 1
        }]
    };

    const config_bar = {
        type: 'bar',
        data: bar_data,
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,   // let the canvas size control the chart
            layout: {
                padding: {
                    right: 40             // extra room for end labels
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'right',
                    formatter: (v) => v + '%',
                    color: '#000',
                    clamp: true           // keep inside chart area
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    };

    const ctx = bar_canvas.getContext('2d');
    new Chart(ctx, config_bar); 

    // Create line chart
    const line_canvas = document.getElementById("prevalence-nilt-line");

    const line_colours = ["#4E95D9", "#00205B", "#68A41E", "#732777", "#CE70D2"]

    let line_values = [];
    for (let i = 0; i < violence_types.length; i ++) {

        let values = [];
        for (let j = 0; j < years.length; j ++) {
            values.push(data.data[stat][years[j]][`${violence_types[i]} violence`]["All respondents"])
        }

        line_values.push({axis: "y",
            label: `${violence_types[i]} violence`,
            data: values,
            fill: false,
            backgroundColor: line_colours[i],
            borderColor: line_colours[i],
            borderWidth: 2
        });
    }

    const line_data = {
        labels: years,
        datasets: line_values
    };

    const config_line = {
        type: 'line',
        data: line_data,
        options: {
            maintainAspectRatio: false,   // let the canvas size control the chart
            layout: {
                padding: {
                    right: 40             // extra room for end labels
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    const ctx_line = line_canvas.getContext('2d');
    new Chart(ctx_line, config_line); 
    

})