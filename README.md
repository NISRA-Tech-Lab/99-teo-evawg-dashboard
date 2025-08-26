# EVAWG Quarto Dashboard

## Project Overview
This project facilitates the creation of a Quarto-based website for the *EVAWG Gender-based Violence - Prevelance* dahsboard.

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

#### Important Files & Folders
There are 4 data prpe files that read in, and prepare, all the data for the .qmd pages that contain charts or maps.

| Data prep file             | Page                                                                 |
|-----------------------------|----------------------------------------------------------------------|
| main_data_prep.R            | NILT.qmd<br>YLT.qmd                                                  |
| recordedcrime_data_prep.R   | recorded-crime-police.qmd<br>recorded-crime-homicide.qmd<br>recorded-crime-victims.qmd<br>recorded-crime-policing-district.qmd |
| domabuse_data_prep.R        | domestic-abuse.qmd                                                   |
| pps_data_prep.R             | public-prosecution.qmd                                               |
