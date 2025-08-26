# EVAWG Quarto Dashboard

## Project Overview
This project facilitates the creation of a Quarto-based website for the *EVAWG Gender-based Violence - Prevelance* dahsboard.   

Data for the dashboard is read in and prepared in files in the `data` folder.  Once the data is read in, content (charts, maps, text etc) can be created on the various `.qmd` files within the `pages` folder. Once the publication content is created it can then be rendered and the output saved to the `docs` folder.

### Prerequisites

- **R 4.4**, **RStudio 2024.04.1-748**, and **GIT for Windows** are required. All are available from ITAssist Store on your desktop.
- All required R packages are listed in `config.R`. By correctly initializing and restoring `renv`, all necessary dependencies will be installed automatically.
- Correct Git configuration on the user's machine. First time users need to run the following lines in the R terminal (updating log in credentials as necessary)
```
git config --global http.sslVerify false
git config --global user.name "GithubUsername"
git config --global user.email firstname.lastname@daera-ni.gov.uk
```

### Using `renv` for Dependency Management

This project includes the `renv` package to manage R packages and dependencies. The `.Rprofile` file ensures that the appropriate repositories are set up, and `renv` is activated upon loading the project.

#### First-Time Setup
1. Open R in the project directory.
2. Run `renv::restore()` to install the required packages from the lockfile.
3. Ensure that binary package installations are preferred for efficiency (`renv.config.install.prefer.binary = TRUE`).

#### Repository Configuration
The `.Rprofile` script dynamically configures package repositories based on available shared drives and includes a fallback to CRAN. This ensures that the correct versions of required packages are sourced from internal or public repositories.

## **Render the Dashboard**
   - Open the `render_dashboard.R` script.
   - Ensure this line `quarto_render(input = here("pages")` is set to "pages".
   - Click **Source** or press `Ctrl + Shift + S` to run the script and generate the updated website.
   - After execution, the website will automatically open in your default web browser.
   - The rendered html file will also be saved in your 'docs' folder. Open the `index.html` file to open the dashboard in a browser.

To render one page at a time, set this line in the `render_dashboard.R` file to the name of your page:
  - `quarto_render(input = here("pages/NILT")`

## DATA
Data for this dashboard comes from 3 different sources:
   - Data files (.xlsx and .sav) within the `data` folder.
   - URL links
   - NISRA Data Portal

### `data` folder
The `data` folder should include the following data files:
   - `nilt_historical_chart1.xlsx`
   - `nilt_historical_chart2.xlsx`
   - `nilt_historical_chart3.xlsx`
   - `ylt_historical_chart1.xlsx`
   - `ylt_historical_chart2.xlsx`
   - `police_recorded_crime_historical_chart1.xlsx`
   - `police_recorded_crime_historical_chart2.xlsx`
   - The current years data for NILT e.g. `NILT23TEOv2.sav`
   - The current years data for YLT e.g. `YLT2024.sav`

The `.xlsx` files in the `data` folder are all historical files that are read in each year before the new year's data is appended onto them and written out to form a new version of the file which is then read in again the next year. Never delete these historical data files. It is recommended you save a copy of them somewhere. 

### URL links
Data from URL links are read in on the `domabuse_data_prep.R` and `recordedcrime_data_prep.R` files. 

### NISRA Data Portal
Data is pulled in from the Nisra Data Portal on the `pps_data_prep` file.
   

### Data Prep and associated pages.
There are 4 data prep files that read in, and prepare, all the data for the .qmd pages that contain charts or maps.

| Data prep file             | Page                                                                 |
|-----------------------------|----------------------------------------------------------------------|
| main_data_prep.R            | NILT.qmd<br>YLT.qmd                                                  |
| recordedcrime_data_prep.R   | recorded-crime-police.qmd<br>recorded-crime-homicide.qmd<br>recorded-crime-victims.qmd<br>recorded-crime-policing-district.qmd |
| domabuse_data_prep.R        | domestic-abuse.qmd                                                   |
| pps_data_prep.R             | public-prosecution.qmd                                               |

The 'Home' page content is within the `index.qmd` file. Quarto dashboards always use the `index.qmd` file as it's home page and will be the default page that is used for links on the dashboard title etc.

## CONFIGURATION
The `config.R` file contains information and settings that are required for the production of the dashboard to run smoothly:
   - R package list.
   - `data_folder`: This variable contains the directory location information for the data folder.   
   - Current-year variables that need set each year for the various sections of the dashboard:   
           - `currentyear`: The current year that the publication is being created in.   
           - Other current-year variables that should be set to the current-year that you have the data for e.g. `nilt_currentyear` may be set to `2023` but `da_currentyear` (domestic abuse) may be set to `2024/25`.
   - NISRA colour palette is set.

## .YML 
The `_quarto.yml` file is swithin the `pages` folder and is responsible for:
   - Setting dashboard title.
   - Dashboard navigation set-up.
   - Page titles.
   - Setting icons on the menu (e.g the home icon)

`href` referes to the .qmd file that you want to be on the menu and dahsboard. `text` referes to the name of the page. For example:
`href: index.qmd text: Home`
This means that the `index.qmd` page is being read in but it will be called `Home` on the dashboard menu.

### Charts

For the charts in the code the R charting package **Plotly** is used. Some
helpful resources are below:

- [Pie Charts in R](https://plotly.com/r/pie-charts/)
- [Plotly R Open Source Graphing Library](https://plotly.com/r/#:~:text=Plotly's%20R%20graphing%20library%20makes,3D%20(WebGL%20based)%20charts.)
- [Plotly R Library Basic Charts](https://plotly.com/r/basic-charts/)
- [Plotly R Library Statistical Charts](https://plotly.com/r/statistical-charts/)
- [GitHub Plotly](<https://gist.github.com/aagarw30/800c4da26eebbe2331860872d31720c1>)
- [Cheatsheets for Plotly](<https://images.plot.ly/plotly-documentation/images/r_cheat_sheet.pdf>)

The code chunk for each chart generally follows a similar pattern. Normally a 
data frame created earlier in one of the data prep files is fed into the `plotly` function
and named, for example `homicide_plot`. Chart parameters are set like chart
`type`, `label`, `values`, `x` and `y` variables, `markers` and `line` aesthetics
like font, size and colour. Other details about the chart like name, label text
and [hover text](https://plotly.com/r/hover-text-and-formatting/) are set next. 

Sometimes, in charts with multiple lines or bars, the
[add_trace](https://plotly.com/r/creating-and-updating-figures/#adding-traces)
function is used to add additional variables.

Following this there is a layout section that sets the aesthetics of the chart
as a whole like axis styling, titles, legends, margins, fonts etc.
[`layout` attributes in plotly](https://plotly.com/r/reference/layout/). Where
required [chart annotations](https://plotly.com/r/text-and-annotations/) are
added in the layout section. Annotations are used to label lines, bars and as
axis titles to help meet accessibility requirements. After the layout section
there is a line of code `config(displayModeBar = FALSE)` that removes `plotly`
logos and other unnecessary tools.

There are many different attributes that are used in the code that help to style
and format the charts. The links below have more information on the different
types of charts in the report and their corresponding styling attributes. There
are more links on styling other charts also.

- [Pie Charts in R](https://plotly.com/r/pie-charts/)
- [Pie chart plolty R attributes](https://plotly.com/r/reference/pie/)
- [Line Plots in R](https://plotly.com/r/line-charts/)
- [Line chart plolty R attributes](https://plotly.com/r/reference/)
- [Bar Charts in R](https://plotly.com/r/bar-charts/)
- [Bar chart plolty R attributes](https://plotly.com/r/reference/bar/)
- [Horizontal Bar Charts in R](https://plotly.com/r/horizontal-bar-charts/)

## Useful links
- [Quarto dashboards](https://quarto.org/docs/dashboards/) - Help with dashboard layouts for individual pages
- [Quarto websites](https://quarto.org/docs/websites/) - Help with programming over all navigation




