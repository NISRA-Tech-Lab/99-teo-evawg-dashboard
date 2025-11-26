import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - Domestice abuse")
    insertHeader();
    insertFooter();
    insertNavButtons("domestic-abuse-reported");

})