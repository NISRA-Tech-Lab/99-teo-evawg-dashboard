import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Case processing times")
    insertHeader();
    insertFooter();
    insertNavButtons();

})