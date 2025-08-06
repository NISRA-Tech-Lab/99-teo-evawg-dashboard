document.addEventListener('DOMContentLoaded', function () {
  
  // Observe changes in the year filter to remove "(All)" option
  let filters = document.getElementsByClassName("form-group");
  
  for (let i = 0; i < filters.length; i ++) {
    const var_observer = new MutationObserver(() => {
    remove_all_option(filters[i]);  // Remove "(All)" from year filter
  });
  
    // Configure the observer to watch for child element changes in `var_filter`
    var_observer.observe(filters[i], { childList: true, subtree: true });
  }
  
})

// Function to hide the "(All)" option
function remove_all_option (filterDiv) {
  // Iterate through options in the filter dropdown and hide any option labeled "(All)"
  const options = filterDiv.getElementsByClassName('option');
  for (let option of options) {
    if (option.textContent.trim() === "(All)") {
      option.style.display = 'none';
    }
  }
};