export function populateInfoBoxes(labels, content) { 
    const info_boxes = document.getElementById("info-boxes");

    let buttons = "";
    let contents = "";
    for (let i = 0; i < labels.length; i ++) {
        buttons += `
        <div class="col-${12 / labels.length}">
                    <h2 class="accordion-header h-100" id="def-heading">
                        <button class="accordion-button collapsed h-100" type="button"
                            data-bs-toggle="collapse" data-bs-target="#button-${i}}-collapse"
                            aria-expanded="false" aria-controls="button-${i}}-collapse">
                            ${labels[i]}
                        </button>
                    </h2>
                </div>
        `;

        contents += `
        <div id="button-${i}}-collapse" class="accordion-collapse collapse" aria-labelledby="def-heading" data-bs-parent="#infoAccordion">
                <div class="accordion-body">
                    ${content[i]}
                </div>
            </div>
        `;
    }

    info_boxes.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-12 col-xl-8 accordion py-4" id="infoAccordion">
                <div class="row g-3">
                ${buttons}
            </div>

            <!-- CONTENT AREAS -->

            <div id="info-card" class="card my-3">

            ${contents}

            </div>

            </div>

        </div>
    `;
}