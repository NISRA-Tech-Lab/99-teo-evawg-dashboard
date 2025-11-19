import { insertHeader, insertFooter, insertNavButtons } from "./utils/page-layout.js"

window.addEventListener("DOMContentLoaded", async () => {

    insertHeader();
    insertFooter();
    insertNavButtons("prevalence-violence-ylt");

})