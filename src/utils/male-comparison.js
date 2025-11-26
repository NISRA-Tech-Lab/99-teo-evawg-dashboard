export function maleComparison () {

  const male_comparison_switch = document.getElementById("male-comparison-switch");
  

  male_comparison_switch.innerHTML = `
    <div class="d-flex justify-content-end">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="male-comparison" checked>
        <label class="form-check-label" for="male-comparison">Male comparison</label>
        </div>
    </div>
  `

  const male_comparison = document.getElementById("male-comparison");
  const male_figs = document.getElementsByClassName("male-fig");

  console.log(male_figs)

  male_comparison.onchange = function () {

    for (let i = 0; i < male_figs.length; i ++) {
        if (male_comparison.checked) {
            male_figs[i].classList.remove("d-none");
        } else {
            male_figs[i].classList.add("d-none");
        }
    }
  }

}