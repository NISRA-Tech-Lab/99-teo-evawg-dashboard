import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Domestic abuse")
    insertHeader();
    insertFooter();
    insertNavButtons("prevalence-of-domestic-abuse");

})