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
  `<div class="row">
    <a id="home-btn" class="col mx-2 nav-btn" href="/">Home</a>
    <a id="prevalence-violence-nilt-btn" class="col mx-2 nav-btn" href="prevalence-violence-nilt.html">Violence against women and men</a>
    <a id="prevalence-violence-ylt-btn" class="col mx-2 nav-btn" href="prevalence-violence-ylt.html">Violence against girls and boys</a>
    <a id="police-recorded-crime-evawg-btn" class="col mx-2 nav-btn" href="police-recorded-crime-evawg.html">Police recorded crime - EVAWG</a>
    <a id="homicides-btn" class="col mx-2 nav-btn" href="homicides.html">Homicides</a>
    <a id="prevalence-of-domestic-abuse-btn" class="col mx-2 nav-btn" href="prevalence-of-domestic-abuse.html">Domestic abuse</a>
    <a id="domestic-abuse-reported-btn" class="col mx-2 nav-btn" href="domestic-abuse-reported.html">Police recorded crime - Domestic abuse</a>
    <a id="case-processing-times-btn" class="col mx-2 nav-btn" href="case-processing-times.html">Case processing times</a>
    <a id="maps-btn" class="col mx-2 nav-btn" href="maps.html">Maps</a>
    <a id="information-btn" class="col mx-2 nav-btn" href="information.html">Information</a>
  </div>`;

  const currentPage = document.getElementById(`${page}-btn`);
  currentPage.classList.add("current-page");
  currentPage.classList.remove("nav-btn");
  currentPage.innerHTML = currentPage.textContent;

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

export async function insertHead(title) {
  const head = document.head;

  // Clear existing head safely if you really need to
  head.innerHTML = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gender-based Violence - ${title}</title>

    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

    <link rel="icon" href="assets/img/icon/favicon.ico" type="image/vnd.microsoft.icon" />
    <link rel="icon" type="image/png" href="assets/img/icon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="assets/img/icon/favicon.svg" />
    <link rel="shortcut icon" href="assets/img/icon/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="assets/img/icon/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Gender-based violence" />

    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.css">
    <link href="https://cdn.jsdelivr.net/npm/@watergis/maplibre-gl-export@4.1.0/dist/maplibre-gl-export.css" rel="stylesheet" />

    <link rel="stylesheet" href="assets/css/styles.css">
  `;

  // helper to load scripts in order
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      head.appendChild(s);
    });

  await loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.0.1/chartjs-plugin-annotation.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2");
  await loadScript("https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js");
  await loadScript("https://cdn.jsdelivr.net/npm/@watergis/maplibre-gl-export@4.1.0/dist/maplibre-gl-export.umd.js");

}

export const chart_colours = ["#4E95D9", "#00205B", "#68A41E", "#732777", "#CE70D2"];
