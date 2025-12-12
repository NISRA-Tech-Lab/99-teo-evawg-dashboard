import { insertHeader, insertFooter, insertNavButtons, insertHead, chart_colours } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js"
import { maleComparison } from "./utils/male-comparison.js";
import { createLineChart, createBarChartData, createBarChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against women and men");
    insertHeader();
    insertFooter();
    maleComparison();
    insertNavButtons();
    let data = await readData("EXPVLADEQ");    

    // Update values
    const stat = "Adult victims of gender-based violence";
    
    updateYearSpans(data, stat);

    insertValue("economic-female", data.data[stat][latest_year]["Economic violence"]["Sex - Female"]);
    insertValue("economic-male", data.data[stat][latest_year]["Economic violence"]["Sex - Male"]);

    insertValue("sexual-female", data.data[stat][latest_year]["Sexual violence"]["Sex - Female"]);
    insertValue("sexual-male", data.data[stat][latest_year]["Sexual violence"]["Sex - Male"]);

    insertValue("physical-female", data.data[stat][latest_year]["Physical violence"]["Sex - Female"]);
    insertValue("physical-male", data.data[stat][latest_year]["Physical violence"]["Sex - Male"]);

    insertValue("psychological-female", data.data[stat][latest_year]["Psychological violence"]["Sex - Female"]);
    insertValue("psychological-male", data.data[stat][latest_year]["Psychological violence"]["Sex - Male"]);

    insertValue("online-female", data.data[stat][latest_year]["Online violence"]["Sex - Female"]);
    insertValue("online-male", data.data[stat][latest_year]["Online violence"]["Sex - Male"]);


    // Create bar chart
    const violence_types = Object.keys(data.data[stat][latest_year])
        .filter(x => x !== "Other types of violence")

    const chart_data = createBarChartData({data, stat, year: latest_year, categories: violence_types});

    createBarChart({
        chart_data,
        categories: violence_types,
        canvas_id: "prevalence-nilt-bar",
        label_format: "%"
    });

    // Create line chart
    createLineChart({
            data,
            stat,
            years,
            line_1: ["Physical violence", "Sex - Female"],
            line_2: ["Physical violence", "Sex - Male"],
            canvas_id: "prevalence-nilt-line"
        });

    // Populate info boxes
    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "short",
            year: "numeric"
        });

    populateInfoBoxes(
        ["Definitions", "Survey", "What does this mean?"],
        [
        `<h2>Definitions</h2>
        <p>The <strong>Northern Ireland Life and Times (NILT) Survey</strong> defines gender-based violence as "violence directed against a person because of that person’s gender, or violence that affects people of a particular gender disproportionately. It does not only relate to physical assaults but also includes words and actions that can cause someone to feel afraid, anxious or humiliated."</p>
        <ul>
            <li><strong>Physical Violence:</strong> Being beaten, slapped, pushed, kicked, choked, restrained, a weapon or any other force being used against you in a way that causes harm.</li>
            <li><strong>Sexual Violence:</strong> Being forced or coerced into having sex against your will or into sexual practices or acts you didn't want to engage in, including unwanted attempted sex and sexual acts, or being choked or restrained.</li>
            <li><strong>Psychological Violence:</strong> Being insulted, stalked, harassed, threatened, humiliated, denigrated or controlled against your will.</li>
            <li><strong>Economic Violence:</strong> Someone controlling your finances and spending and other resources against your will.</li>
            <li><strong>Online Violence:</strong> Receiving threats online or via social media, online trolling, or being sent or being asked for intimate images against your will.</li>
        </ul>`,

        `<h2>Survey</h2>
        <p>The <strong>Northern Ireland Life and Times (NILT) Survey</strong> records the attitudes, values, and beliefs of adults to a wide range of social policy issues.  This annual survey has been running since 1998 and is administered by ARK. ARK is Northern Ireland’s social policy hub and is made up of academics across QUB and Ulster University.</p>
        <p>Its mission is to monitor the attitudes and behaviour of people in Northern Ireland annually to provide a time-series and a public record of how our attitudes and behaviour develop on a wide range of social policy issues. </p>
        <p>Fieldwork for the NILT survey is carried out between September and January with approximately 1,200 respondents aged 18 years or over, interviewed annually. </p>
        <p>The Violence Against Women and Girls (VAWG) module of NILT is sponsored by The Executive Office.</p>
        <p>This data is available on the <a href="https://ppdata.nisra.gov.uk/table/EXPVLADEQ" target="_blank">NISRA Data Portal</a>.</p>
        <p>Statistical publications relating to the EVAWG stragegy can be found on the <a href="https://www.executiveoffice-ni.gov.uk/topics/ending-violence-against-women-and-girls-evawg" target="_blank">Executive Office website</a>.</p>
        <p>Updates: Data updated annually. Last update: ${update_date}.</p>`,

        `<h2>What does this mean?</h2>
        <p>Questions relating to gender-based violence have been included in the <strong>Northern Ireland Life and Times (NILT)</strong> survey since 2022 to attempt to gain more understanding of the prevalence of gender-based violence in Northern Ireland.</p>
        <p>The NILT is a representative survey of adults in Northern Ireland, and respondents are provided with definitions of gender-based violence. The data from this survey represents self-reported experience of gender-based violence.</p>
        <p>After initial question development, a time series will be developed in future years from a baseline in 2023.</p>`
        ]
    );

})