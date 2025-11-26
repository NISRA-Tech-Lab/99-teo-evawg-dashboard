import { insertHeader, insertFooter, insertNavButtons } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";

window.addEventListener("DOMContentLoaded", async () => {

    insertHeader();
    insertFooter();
    maleComparison();
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
    
    
       

    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "Other types of violence")
        .map(x => x.replace(/ violence$/, ""));

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < violence_types.length; i ++) {
        female_bars.push(data.data[stat][latest_year][`${violence_types[i]} violence`][`Gender - Female`]);
        male_bars.push(data.data[stat][latest_year][`${violence_types[i]} violence`][`Gender - Male`]);
    } 

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
    const barChart =new Chart(ctx, config_bar); 

    const male_comparison = document.getElementById("male-comparison");
    
    male_comparison.addEventListener("change", function () {
        const showMales = male_comparison.checked;

        // dataset index 1 is the "Males (%)" series
        barChart.data.datasets[1].hidden = !showMales;

        barChart.update();
    });

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