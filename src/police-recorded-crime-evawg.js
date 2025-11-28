import { maleComparison } from "./utils/male-comparison.js";
import { createMaleFemaleLineChart, createViolenceTypeBarChart } from "./utils/charts.js";
import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - EVAWG")
    insertHeader();
    insertFooter();
    insertNavButtons("police-recorded-crime-evawg");
    maleComparison();
    let data = await readData("PRCVCTM");
    
    // Update values
    const stat = "All crimes recorded by the police";

    updateYearSpans(data, stat);

    //// Violence against the person
    const violence_victims = data.data[stat][latest_year]
        ["Violence with injury (including homicide & death/serious injury by unlawful driving)"]
        ["All ages"]["All persons"] +
        data.data[stat][latest_year]
            ["Violence without injury"]
            ["All ages"]["All persons"];

    const female_violence_victims = data.data[stat][latest_year]
        ["Violence with injury (including homicide & death/serious injury by unlawful driving)"]
        ["All ages"]["Female"] +
        data.data[stat][latest_year]
            ["Violence without injury"]
            ["All ages"]["All persons"];

    const male_violence_victims = data.data[stat][latest_year]
        ["Violence with injury (including homicide & death/serious injury by unlawful driving)"]
        ["All ages"]["Male"] +
        data.data[stat][latest_year]
            ["Violence without injury"]
            ["All ages"]["All persons"];    

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
    createMaleFemaleLineChart({
        data,
        stat,
        years,
        female_selection: ["Sexual offences", "All ages", "Female"],
        male_selection: ["Sexual offences", "All ages", "Male"],
        canvas_id: "sexual-offences-line"
    });

    // Stalking and harassment line chart
    createMaleFemaleLineChart({
        data,
        stat,
        years,
        female_selection: ["Stalking and harassment", "All ages", "Female"],
        male_selection: ["Stalking and harassment", "All ages", "Male"],
        canvas_id: "stalking-line"
    });
   
    // Create bar chart
    const violence_types = [
        "Violence with injury (including homicide & death/serious injury by unlawful driving)",
        "Violence without injury"
    ];

    createViolenceTypeBarChart({
        data,
        stat,
        year: latest_year,
        violence_types,
        canvas_id: "violence-bar",
        label_format: ","
    });


})