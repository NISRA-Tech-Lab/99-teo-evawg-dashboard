    
import { chart_colours } from "./page-layout.js";

export function createMaleFemaleLineChart({data, stat, years, female_selection, male_selection, canvas_id}) {

    const line_canvas = document.getElementById(canvas_id);

    let line_values = [];
    let female_values = [];
    let male_values = [];

    for (let i = 0; i < years.length; i++) {
    const base = data.data[stat][years[i]];   // start point for that year

    if (female_selection.includes("No violence")) {
        female_values.push(100 - getNested(base, female_selection));
        male_values.push(100 - getNested(base, male_selection));
    } else {
        female_values.push(getNested(base, female_selection));
        male_values.push(getNested(base, male_selection));
    }
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

    const male_comparison = document.getElementById("male-comparison");
    let showMales = male_comparison.checked;

    line_chart.data.datasets[1].hidden = !showMales;

    male_comparison.addEventListener("change", function () {
        showMales = male_comparison.checked;
        line_chart.data.datasets[1].hidden = !showMales;
        line_chart.update();
    });

}

export function createViolenceTypeBarChart({data, stat, year, violence_types, canvas_id}) {

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < violence_types.length; i ++) {
        female_bars.push(data.data[stat][year][violence_types[i]][`Sex - Female`]);
        male_bars.push(data.data[stat][year][violence_types[i]][`Sex - Male`]);
    } 

    const bar_canvas = document.getElementById("prevalence-nilt-bar");

    const bar_data = {
        labels: violence_types,
        datasets: [{
            axis: 'y',
            label: 'Females (%)',
            data: female_bars,
            fill: false,
            backgroundColor: chart_colours[0],
            borderWidth: 1
        },
        {
            axis: 'y',
            label: 'Males (%)',
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
    const barChart = new Chart(ctx, config_bar); 

    // Toggle male comparison in charts
    const male_comparison = document.getElementById("male-comparison");
    let showMales = male_comparison.checked;
    barChart.data.datasets[1].hidden = !showMales;
    
    male_comparison.addEventListener("change", function () {
        showMales = male_comparison.checked;

        // dataset index 1 is the "Males (%)" series
        barChart.data.datasets[1].hidden = !showMales;

        barChart.update();
    });


}

function getNested(obj, path) {
  return path.reduce((acc, key) => acc?.[key], obj);
}
