import { maleComparison } from "./utils/male-comparison.js";
import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js";
import { wrapLabel } from "./utils/wrap-label.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - EVAWG")
    insertHeader();
    insertFooter();
    insertNavButtons("police-recorded-crime-evawg");
    maleComparison();
    let data = await readData("PRCVCTM");
    
    // Update values
    const stat = "All crimes recorded by the police";

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

    //// Violence against the person
    const violence_victims = data.data[stat][latest_year]
        ["Violence with injury (including homicide & death/serious injury by unlawful driving)"]
        ["All ages"]["All persons"];

    const female_violence_victims = data.data[stat][latest_year]
        ["Violence with injury (including homicide & death/serious injury by unlawful driving)"]
        ["All ages"]["Female"];

    const male_violence_victims = data.data[stat][latest_year]
        ["Violence with injury (including homicide & death/serious injury by unlawful driving)"]
        ["All ages"]["Male"];    

    document.getElementById("violence-female").textContent = Math.round(female_violence_victims / violence_victims * 100);
    document.getElementById("violence-male").textContent = Math.round(male_violence_victims / violence_victims * 100);

    //// Stalking and harassment
    const stalking_victims = data.data[stat][latest_year]
        ["Stalking and harassment"]
        ["All ages"]["All persons"];

    const female_stalking_victims = data.data[stat][latest_year]
        ["Stalking and harassment"]
        ["All ages"]["Female"];

    const male_stalking_victims = data.data[stat][latest_year]
        ["Stalking and harassment"]
        ["All ages"]["Male"]

    document.getElementById("stalking-female").textContent = Math.round(female_stalking_victims / stalking_victims * 100);
    document.getElementById("stalking-male").textContent = Math.round(male_stalking_victims / stalking_victims * 100);

    //// Sexual offences
    const sex_victims = data.data[stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["All persons"];

    const female_sex_victims = data.data[stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["Female"];

    const male_sex_victims = data.data[stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["Male"]

    document.getElementById("sex-female").textContent = Math.round(female_sex_victims / sex_victims * 100);
    document.getElementById("sex-male").textContent = Math.round(male_sex_victims / sex_victims * 100);

    //// Online violence
    const online_victims = data.data[stat][latest_year]
        ["Violence without injury"]
        ["All ages"]["All persons"];

    const female_online_victims = data.data[stat][latest_year]
        ["Violence without injury"]
        ["All ages"]["Female"];

    const male_online_victims = data.data[stat][latest_year]
        ["Violence without injury"]
        ["All ages"]["Male"]

    document.getElementById("online-female").textContent = Math.round(female_online_victims / online_victims * 100);
    document.getElementById("online-male").textContent = Math.round(male_online_victims / online_victims * 100);

    // Sexual offences line chart
    const line_canvas = document.getElementById("sexual-offences-line");

    let line_values = [];
    let female_values = [];
    let male_values = [];
    for (let j = 0; j < years.length; j ++) {
        female_values.push(data.data[stat][years[j]]["Sexual offences"]["All ages"]["Female"]);
        male_values.push(data.data[stat][years[j]]["Sexual offences"]["All ages"]["Male"]);
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
        label: "Males",
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
    const sexual_line_chart = new Chart(ctx_line, config_line);

    // Stalking and harassment line chart
    const stalking_line_canvas = document.getElementById("stalking-line");

    line_values = [];
    female_values = [];
    male_values = [];
    for (let j = 0; j < years.length; j ++) {
        female_values.push(data.data[stat][years[j]]["Stalking and harassment"]["All ages"]["Female"]);
        male_values.push(data.data[stat][years[j]]["Stalking and harassment"]["All ages"]["Male"]);
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
        label: "Males",
        data: male_values,
        fill: false,
        backgroundColor: chart_colours[1],
        borderColor: chart_colours[1],
        borderWidth: 2
    });


    const stalking_line_data = {
        labels: years,
        datasets: line_values
    };

    const stalking_config_line = {
        type: 'line',
        data: stalking_line_data,
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

    const stalking_ctx_line = stalking_line_canvas.getContext('2d');
    const stalking_line_chart = new Chart(stalking_ctx_line, stalking_config_line);

    // Create bar chart
    const violence_types = [
        "Violence with injury (including homicide & death/serious injury by unlawful driving)",
        "Violence without injury"
    ];

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < violence_types.length; i ++) {
        female_bars.push(data.data[stat][latest_year]
            [violence_types[i]]
            ["All ages"]["Female"]);
        male_bars.push(data.data[stat][latest_year]
            [violence_types[i]]
            ["All ages"]["Male"]);
    } 

    const bar_canvas = document.getElementById("violence-bar");

    const bar_data = {
        labels: violence_types,
        datasets: [{
            axis: 'y',
            label: 'Females',
            data: female_bars,
            fill: false,
            backgroundColor: chart_colours[0],
            borderWidth: 1
        },
        {
            axis: 'y',
            label: 'Males',
            data: male_bars,
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
                    formatter: (v) => v.toLocaleString(),
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
                    },
                    ticks: {
                        callback: function(value) {
                            const label = this.getLabelForValue(value);
                            return wrapLabel(label, 35); // tweak width to taste
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    };

    const ctx = bar_canvas.getContext('2d');
    const barChart = new Chart(ctx, config_bar); 

    // Toggle male comparison in charts
    const male_comparison = document.getElementById("male-comparison");
    let showMales = male_comparison.checked;
    barChart.data.datasets[1].hidden = !showMales;

    sexual_line_chart.data.datasets[1].hidden = !showMales;
    stalking_line_chart.data.datasets[1].hidden = !showMales;

    
    male_comparison.addEventListener("change", function () {
        showMales = male_comparison.checked;

        // dataset index 1 is the "Males (%)" series
        barChart.data.datasets[1].hidden = !showMales;

        sexual_line_chart.data.datasets[1].hidden = !showMales;
        stalking_line_chart.data.datasets[1].hidden = !showMales;

        barChart.update();
        sexual_line_chart.update();
        stalking_line_chart.update();
    });


})