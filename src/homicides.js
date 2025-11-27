import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { maleComparison } from "./utils/male-comparison.js";
import { readData } from "./utils/read-data.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Homicides");
    insertHeader();
    insertFooter();
    insertNavButtons("homicides");
    maleComparison();
    let data = await readData("PRCHOM");

    // Update values
    const stat = "All homicides";

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
    
    // Create line chart
    const line_canvas = document.getElementById("homicide-line");

    let line_values = [];
    let female_values = [];
    let male_values = [];
    for (let j = 0; j < years.length; j ++) {
        female_values.push(data.data[stat][years[j]]["All ages"]["Female"]);
        male_values.push(data.data[stat][years[j]]["All ages"]["Male"]);
    }

    line_values.push({axis: "y",
        label: "Female",
        data: female_values,
        fill: false,
        backgroundColor: chart_colours[0],
        borderColor: chart_colours[0],
        borderWidth: 2
    });

    line_values.push({axis: "y",
        label: "Male",
        data: male_values,
        fill: false,
        backgroundColor: chart_colours[1],
        borderColor: chart_colours[1],
        borderWidth: 2
    });


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
    const line_chart = new Chart(ctx_line, config_line);

    // Toggle male comparison in charts
    const male_comparison = document.getElementById("male-comparison");
    let showMales = male_comparison.checked;
    
    line_chart.data.datasets[1].hidden = !showMales;
        
    male_comparison.addEventListener("change", function () {
        showMales = male_comparison.checked;

        line_chart.data.datasets[1].hidden = !showMales;
        
        
        line_chart.update();
        
    });




})