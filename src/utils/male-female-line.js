    
import { chart_colours } from "./page-layout.js";

export function createMaleFemaleLineChart({data, stat, years, female_selection, male_selection, canvas_id}) {

    const line_canvas = document.getElementById(canvas_id);

    let line_values = [];
    let female_values = [];
    let male_values = [];

    for (let i = 0; i < years.length; i++) {
    const base = data.data[stat][years[i]];   // start point for that year

    female_values.push(getNested(base, female_selection));
    male_values.push(getNested(base, male_selection));
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

function getNested(obj, path) {
  return path.reduce((acc, key) => acc?.[key], obj);
}
