import { getSelectedGender } from "./get-selected-gender.js";

export function maleComparison () {

  const male_comparison_switch = document.getElementById("male-comparison-switch");

  male_comparison_switch.innerHTML = `
    <form id="gender-form" class="d-flex justify-content-end">
    <span class="me-3">Display figures for:</span>
    <div class="form-check me-2">
        <input class="form-check-input" type="radio" name="gender-select" id="all-comparison" value="all" checked>
        <label class="form-check-label" for="all-comparison">All persons</label>
      </div>
    <div class="form-check me-2">
        <input class="form-check-input" type="radio" name="gender-select" id="female-comparison" value="female" >
        <label class="form-check-label" for="female-comparison">Females only</label>
      </div>
      <div class="form-check me-2">
        <input class="form-check-input" type="radio" name="gender-select" id="male-comparison" value="male" >
        <label class="form-check-label" for="male-comparison">Males only</label>
      </div>
      </form>
      
    </div>
  `
  const gender_form = document.getElementById("gender-form");
  const male_figs = document.getElementsByClassName("male-fig");
  const female_figs = document.getElementsByClassName("female-fig");
  const all_comparison = document.getElementById("all-comparison");
  const female_comparison = document.getElementById("female-comparison");
  const male_comparison = document.getElementById("male-comparison");

  let selectedGender = getSelectedGender(); 
  
  function hideMaleFigs () {
    for (let i = 0; i < male_figs.length; i ++) {
      if (selectedGender === "female") {
          male_figs[i].classList.add("d-none");
      } else {
          male_figs[i].classList.remove("d-none");
          if (selectedGender === "male") {
            male_figs[i].classList.add("display-6");
          } else {
            male_figs[i].classList.remove("display-6");
          }
      }
    }
  }

  function hideFemaleFigs () {
    for (let i = 0; i < female_figs.length; i ++) {
      if (selectedGender === "male") {
          female_figs[i].classList.add("d-none");
      } else {
          female_figs[i].classList.remove("d-none");
      }
    }
  }

  if (localStorage.getItem("genderSelection") == null) {
    localStorage.setItem("genderSelection", "all");
  } else {
    selectedGender = localStorage.getItem("genderSelection");
    if (selectedGender === "male") {
      all_comparison.checked = false;
      male_comparison.checked = true;
      female_comparison.checked = false;
    } else if (selectedGender === "female") {
      all_comparison.checked = false;
      male_comparison.checked = false;
      female_comparison.checked = true;
    }
    hideFemaleFigs();
    hideMaleFigs();
  }

  gender_form.addEventListener("change", function () {
    selectedGender = getSelectedGender();
    hideFemaleFigs();
    hideMaleFigs();
    localStorage.setItem("genderSelection", selectedGender);
  });

}

