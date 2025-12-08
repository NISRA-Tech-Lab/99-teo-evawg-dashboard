import { insertHeader, insertFooter, insertHead, insertNavButtons } from "./utils/page-layout.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Information");
    insertHeader();
    insertFooter();
    insertNavButtons();
    

})