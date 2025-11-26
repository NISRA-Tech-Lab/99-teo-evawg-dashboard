import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Homicides");
    insertHeader();
    insertFooter();
    insertNavButtons("homicides");

})