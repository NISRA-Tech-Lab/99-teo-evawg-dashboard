import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against girls and boys")
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons("prevalence-violence-ylt");
    let data = await readData("EXPVLYTHEQ");

    // Update values

    const stat = "Victims of gender-based violence";

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

    const no_violence_girl = data.data[stat][latest_year]['No violence']['Gender - Female'];
    const no_violence_boy   = data.data[stat][latest_year]['No violence']['Gender - Male'];

    const violence_girl = 100 - Number(no_violence_girl);
    const violence_boy   = 100 - Number(no_violence_boy);


    document.getElementById("violence-girl").textContent = violence_girl;
    document.getElementById("violence-boy").textContent  = violence_boy;
    document.getElementById("online-girl").textContent = data.data[stat][latest_year][`Online violence`][`Gender - Female`];
    document.getElementById("online-boy").textContent = data.data[stat][latest_year][`Online violence`][`Gender - Male`];
    document.getElementById("sexual-girl").textContent = data.data[stat][latest_year][`Sexual violence`][`Gender - Female`];
    document.getElementById("sexual-boy").textContent = data.data[stat][latest_year][`Sexual violence`][`Gender - Male`];
    document.getElementById("psychological-girl").textContent = data.data[stat][latest_year][`Psychological violence`][`Gender - Female`];
    document.getElementById("psychological-boy").textContent = data.data[stat][latest_year][`Psychological violence`][`Gender - Male`];
    document.getElementById("physical-girl").textContent = data.data[stat][latest_year][`Physical violence`][`Gender - Female`];
    document.getElementById("physical-boy").textContent = data.data[stat][latest_year][`Physical violence`][`Gender - Male`];

    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "No violence")
        .map(x => x.replace(/ violence$/, ""));

    let girl_bars = [];
    let boy_bars = [];
    for (let i = 0; i < violence_types.length; i ++) {
        girl_bars.push(data.data[stat][latest_year][`${violence_types[i]} violence`][`Gender - Female`]);
        boy_bars.push(data.data[stat][latest_year][`${violence_types[i]} violence`][`Gender - Male`]);
    } 

    const bar_canvas = document.getElementById("prevalence-ylt-bar");

    const bar_data = {
        labels: violence_types,
        datasets: [{
            axis: 'y',
            label: 'Girls (%)',
            data: girl_bars,
            fill: false,
            backgroundColor: chart_colours[0],
            borderWidth: 1
        },
        {
            axis: 'y',
            label: 'Boys (%)',
            data: boy_bars,
            fill: false,
            backgroundColor: chart_colours[1],
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
    let showMales = male_comparison.checked;
    barChart.data.datasets[1].hidden = !showMales;
    
    male_comparison.addEventListener("change", function () {
        showMales = male_comparison.checked;

        // dataset index 1 is the "Males (%)" series
        barChart.data.datasets[1].hidden = !showMales;

        barChart.update();
    });


})