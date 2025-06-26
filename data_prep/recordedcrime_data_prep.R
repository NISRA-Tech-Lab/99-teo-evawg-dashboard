library(here)
source(paste0(here(), "/config.R"))

# READ IN THE DATA

# URL being functioned and saved onto a temp file
police_rec_crime_url <-"https://www.psni.police.uk/system/files/2025-01/444101239/Police_Recorded_Crime_in_Northern_Ireland_1998-99_to_2023-24_revised.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(police_rec_crime_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))

# Create a data frame for the data in the temp file
police_rec_crime_98_24 <- read_excel(temp_file,
                                     sheet = "Table 2.2",
                                     range = "A3:AC204")

pivot_tab_vic_gen_age <- read_excel(temp_file,
                                    sheet = "Pivot Table-Victim Gender_Age",
                                    range = "A12:T629")
