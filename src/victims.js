import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Police recorded crime - EVAWG")
    insertHeader();
    insertFooter();
    insertNavButtons("victims");

})