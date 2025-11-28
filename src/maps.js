import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Maps");
    insertHeader();
    insertFooter();
    insertNavButtons("maps");

})