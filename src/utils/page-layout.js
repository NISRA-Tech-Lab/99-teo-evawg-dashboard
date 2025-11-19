export function insertHeader () {

    const nav = document.getElementById("nav");

    nav.classList.add("navbar");
    nav.classList.add("p-0");
    nav.style.backgroundColor = "#00205b";
    nav.innerHTML = `<div class="container-fluid d-flex flex-column align-items-stretch p-0">
    <!-- Banner row (full width) -->
    <div class="w-100" style="background-color:#3878c5;">
        <div class="text-white text-center py-2 px-3">
            <strong>We welcome feedback from users through our 
                <a href="#" target="_blank">short survey</a>
            </strong>
        </div>
    </div>

    <!-- Main navbar row -->
    <div class="d-flex align-items-center justify-content-between w-100 py-3 px-2">

        <!-- Left: NISRA logo -->
        <a class="navbar-brand ps-2 d-flex align-items-center" href="./">
            <img src="assets/img/logo/nisra-only-white.svg" 
                 alt="NISRA logo" height="60" class="me-3">
        </a>

        <!-- Center: Page title -->
        <div class="flex-grow-1 text-center">
            <h1 class="mb-0 text-white fs-2 app-title">Gender-based violence</h1>
        </div>

        <!-- Right: TEO logo -->
        <a class="navbar-brand pe-2 d-flex align-items-center" href="./">
            <img src="assets/img/logo/teo-white.png" 
                 alt="TEO logo" height="60" class="ms-3">
        </a>

    </div>
</div>
`
}

export function insertNavButtons(page) {

  const nav = document.getElementById("nav");

  nav.innerHTML +=
  `<div class="row py-1">
    <div id="home-btn" class="col mx-2"><a href="index.html">Home</a></div>
    <div id="prevalence-violence-nilt-btn" class=col mx-2"><a href="prevalence-violence-nilt.html">Prevalence of violence (women and men)</a></div>
    <div id="prevalence-violence-ylt-btn" class=col mx-2"><a href="prevalence-violence-ylt.html">Prevalence of violence (girls and boys)</a></div>
    <div id="victims-btn" class=col mx-2"><a href="victims.html">Victims of crime and offences</a></div>
    <div id="homicides-btn" class=col mx-2"><a href="homicides.html">Homicides</a></div>
    <div id="prevalence-of-domestic-abuse-btn" class=col mx-2"><a href="prevalence-of-domestic-abuse.html">Prevalence of domestic abuse</a></div>
    <div id="domestic-abuse-reports-btn" class=col mx-2"><a href="domestic-abuse-reports.html">Domestic abuse reports to police</a></div>
    <div id="case-processing-times-btn" class=col mx-2"><a href="case-processing-times.html">Case processing times</a></div>
    <div id="maps-btn" class=col mx-2"><a href="maps.html">Maps</a></div>
    <div id="information-btn" class=col mx-2"><a href="information.html">Information</a></div>
  </div>`;

  document.getElementById(`${page}-btn`).classList.add("current-page");

}

export function insertFooter () {

    const footer = document.getElementById("footer");

    footer.classList.add("footer");
    footer.classList.add("mt-auto");
    footer.classList.add("py-4");
    footer.classList.add("bg-nisra");
    footer.classList.add("text-nisra");

    
    footer.innerHTML = `<div class="container">
      <!-- 3 column section -->
      <div class="row mb-3">
        <div class="col-md-4">
          <h5>Data Tools</h5>
          <ul class="list-unstyled">
            <li><a href="https://explore.nisra.gov.uk/local-stats/">Local Statistics Explorer</a></li>
            <li><a href="https://data.nisra.gov.uk">Data Portal</a></li>
            <li><a href="https://build.nisra.gov.uk/en/">Census Flexible Table Builder</a></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h5>Corporate</h5>
          <ul class="list-unstyled">
            <li><a href="https://www.nisra.gov.uk/">NISRA Website</a></li>
            <li><a href="https://www.nisra.gov.uk/statistics/about-nisra/careers">Careers</a></li>
            <li><a href="https://www.nisra.gov.uk/contact">Contact</a></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h5>Follow</h5>
          <ul class="list-inline">
            <li class="list-inline-item">
              <a href="https://www.facebook.com/nisra.gov.uk">
                <img src="assets/img/logo/facebook-brands-solid-full.svg" class="img-50"/>
              </a>
            </li>
            <li class="list-inline-item">
              <a href="https://x.com/NISRA/">
                <img src="assets/img/logo/x-twitter-brands-solid-full.svg" class="img-50"/>
              </a>
            </li>
            <li class="list-inline-item">
              <a href="https://www.youtube.com/user/nisrastats">
                <img src="assets/img/logo/youtube-brands-solid-full.svg" class="img-50"/>
              </a>
            </li>
            <li class="list-inline-item">
              <a href="https://www.linkedin.com/company/northern-ireland-statistics-and-research-agency/">
                <img src="assets/img/logo/linkedin-in-brands-solid-full.svg" class="img-50"/>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Horizontal list with separators -->
      <ul class="list-inline footer-links text-center mb-0">
        <li class="list-inline-item"><a href="https://www.nisra.gov.uk/crown-copyright">© Crown Copyright</a></li>
        <li class="list-inline-item">|</li>
        <li class="list-inline-item"><a href="https://www.nisra.gov.uk/terms-and-conditions">Terms and conditions</a></li>
        <li class="list-inline-item">|</li>
        <li class="list-inline-item"><a href="https://www.nisra.gov.uk/cookies">Cookies</a></li>
        <li class="list-inline-item">|</li>
        <li class="list-inline-item"><a href="https://www.nisra.gov.uk/nisra-privacy-notice">Privacy</a></li>
        <li class="list-inline-item">|</li>
        <li class="list-inline-item"><a href="https://www.nisra.gov.uk/accessibility-statement-nisra">Accessibility Statement</a></li>
      </ul>
    </div>`
}