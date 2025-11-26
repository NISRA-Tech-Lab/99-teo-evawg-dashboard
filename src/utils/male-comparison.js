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

  function hideMaleFigs () {
    for (let i = 0; i < male_figs.length; i ++) {
      if (male_comparison.checked) {
          male_figs[i].classList.remove("d-none");
      } else {
          male_figs[i].classList.add("d-none");
      }
    }
  }

  if (localStorage.getItem("maleComparison") == null) {
    localStorage.setItem("maleComparison", male_comparison.checked);
  } else {
    male_comparison.checked = localStorage.getItem("maleComparison") === null ? false : localStorage.getItem("maleComparison") === "true";
    hideMaleFigs();
  }
  

  male_comparison.addEventListener("change", function () {
    hideMaleFigs()
    localStorage.setItem("maleComparison", male_comparison.checked);
  });

}