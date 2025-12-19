import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { insertValue } from "./utils/insert-value.js";
import { readData } from "./utils/read-data.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - Domestice abuse")
    insertHeader();
    insertNavButtons();

    const data = await readData("DOMACLGD");
    const stat = "All domestic abuse crimes";
    updateYearSpans(data, stat);

    insertValue("domestic-abuse-count", data.data[stat][latest_year]["Northern Ireland"].toLocaleString());

    insertFooter();
})