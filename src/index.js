import { insertHeader, insertFooter, insertHead } from "./utils/page-layout.js";
import { readData } from "./utils/read-data.js";
import { insertValue } from "./utils/insert-value.js";
import { latest_year, updateYearSpans } from "./utils/update-years.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Home");
    insertHeader();

    // Insert values into homepage cards
    const EXPVAS = await readData("EXPVAS");
    const EXPVAS_stat = "Adult victims of violence";
    updateYearSpans(EXPVAS, EXPVAS_stat);

    insertValue("violence-women", 100 - EXPVAS.data[EXPVAS_stat][latest_year]["No forms of violence"]["Female"]);   

    // % of 16-year-old girls have experienced violence
    const EXPVLYTHEQ = await readData("EXPVLYTHEQ");
    const EXPVLYTHEQ_stat = "Victims of gender-based violence"
    updateYearSpans(EXPVLYTHEQ, EXPVLYTHEQ_stat);

    insertValue("violence-girl", 100 - EXPVLYTHEQ.data[EXPVLYTHEQ_stat][latest_year]["No violence"]["Sex - Female"]);

    // % of victims of sexual offences are women
    const PRCVCTM = await readData("PRCVCTM");
    const PRCVCTM_stat = "All crimes recorded by the police";
    updateYearSpans(PRCVCTM, PRCVCTM_stat);

    const sex_victims = PRCVCTM.data[PRCVCTM_stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["All persons"];

    const female_sex_victims = PRCVCTM.data[PRCVCTM_stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["Female"];

    insertValue("sexual-violence", Math.round(female_sex_victims / sex_victims * 100));

    // % of women have experienced domestic abuse
    const EXPDA = await readData("EXPDA");
    const EXPDA_stat = "Victims of domestic abuse";
    updateYearSpans(EXPDA, EXPDA_stat);

    insertValue("domestic-abuse",Math.round(EXPDA.data[EXPDA_stat][latest_year]["Any domestic abuse"]["Lifetime (since age 16)"]["Female"])
);

    // % of stalking and harrassment victims are female
    const stalking_victims = PRCVCTM.data[PRCVCTM_stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["All persons"];

    const female_stalking_victims = PRCVCTM.data[PRCVCTM_stat][latest_year]
        ["Sexual offences"]
        ["All ages"]["Female"];

    insertValue("stalking", Math.round(female_stalking_victims / stalking_victims * 100));

    // Case processing times - average days to complete
    const INDPRCASEEQ = await readData("INDPRCASEEQ");
    const INDPRCASEEQ_stat = "Average time taken to complete criminal cases";
    updateYearSpans(INDPRCASEEQ, INDPRCASEEQ_stat);

    insertValue("sexual-days", INDPRCASEEQ.data[INDPRCASEEQ_stat][latest_year]["Offence category - Sexual"]);
    insertValue("all-days", INDPRCASEEQ.data[INDPRCASEEQ_stat][latest_year]["Northern Ireland"]);

    populateInfoBoxes(
        ["For help and support"],
        [`<a href="https://www.executiveoffice-ni.gov.uk/articles/support-services-executiveoffice" target="_blank">Support Services</a>
        <p>The information on this page will direct you to services that will support you if you have concerns about an issue of coercive control.</p>
        `]
    )

    const first_card_body = document.querySelectorAll(".card-body")[0];
    const map_img = document.getElementById("map-img");
    
    map_img.height = first_card_body.clientHeight;
    map_img.width = map_img.naturalWidth / map_img.naturalHeight * map_img.height;
    
    
    insertFooter();

})