    
import { chart_colours } from "./page-layout.js";
import { wrapLabel } from "./wrap-label.js";
import { getSelectedGender } from "./get-selected-gender.js";
import { getNested } from "./get-nested.js";

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

    let selectedGender = getSelectedGender(); 
    const gender_form = document.getElementById("gender-form");

    let show_males = selectedGender != "female";
    let show_females = selectedGender != "male";

    line_chart.data.datasets[1].hidden = !show_males;
    line_chart.data.datasets[0].hidden = !show_females;

    gender_form.addEventListener("change", function () {
        selectedGender = getSelectedGender(); 
        show_males = selectedGender != "female";
        show_females = selectedGender != "male";
        line_chart.data.datasets[1].hidden = !show_males;
        line_chart.data.datasets[0].hidden = !show_females;
        line_chart.update();
    });

}

export function createViolenceTypeBarChart({data, stat, year, violence_types, canvas_id, label_format}) {

    

    let female_bars = [];
    let male_bars = [];
    for (let i = 0; i < violence_types.length; i ++) {
        if (data.label == "Police recorded crime - victims of crime") {
             female_bars.push(data.data[stat][year]
                [violence_types[i]]
                ["All ages"]["Female"]);
            male_bars.push(data.data[stat][year]
                [violence_types[i]]
                ["All ages"]["Male"]);
        } else {
            let female_key = Object.keys(data.data[stat][year][violence_types[i]]).filter(x => x.includes("Female"));
            let male_key = Object.keys(data.data[stat][year][violence_types[i]]).filter(x => x.includes("Male"));
            female_bars.push(data.data[stat][year][violence_types[i]][female_key]);
            male_bars.push(data.data[stat][year][violence_types[i]][male_key]);
        }
    } 

    const bar_canvas = document.getElementById(canvas_id);

    const bar_data = {
        labels: violence_types,
        datasets: [{
            axis: 'y',
            label: `Females${label_format === "%" ? " (%)" : ""}`,
            data: female_bars,
            fill: false,
            backgroundColor: chart_colours[0],
            borderWidth: 1
        },
        {
            axis: 'y',
            label: `Males${label_format === "%" ? " (%)" : ""}`,
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
                    formatter: (v) => {
                        if (label_format === "%") return `${v}%`;
                        if (label_format === ",") return Number(v).toLocaleString();
                        return v; // fallback if something else shows up
                        },
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
                            return wrapLabel(label, 35); 
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    };

    const ctx = bar_canvas.getContext('2d');
    const bar_chart = new Chart(ctx, config_bar); 

    let selectedGender = getSelectedGender(); 
    const gender_form = document.getElementById("gender-form");

    let show_males = selectedGender != "female";
    let show_females = selectedGender != "male";

    bar_chart.data.datasets[1].hidden = !show_males;
    bar_chart.data.datasets[0].hidden = !show_females;

    gender_form.addEventListener("change", function () {
        selectedGender = getSelectedGender(); 
        show_males = selectedGender != "female";
        show_females = selectedGender != "male";
        bar_chart.data.datasets[1].hidden = !show_males;
        bar_chart.data.datasets[0].hidden = !show_females;
        bar_chart.update();
    });


}


