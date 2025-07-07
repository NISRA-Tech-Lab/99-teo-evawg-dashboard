library(here)
source(paste0(here(), "/config.R"))


# READ IN THE DATA

# URL being functioned and saved onto a temp file
pps_url <-"https://www.ppsni.gov.uk/files/ppsni/2024-06/PPS%20Statistical%20Bulletin%202023_24%20Tables.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(pps_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))

# Create a data frame for the data in the temp file
files_received_pps <- read_excel(temp_file,
                                     sheet = "Table 1B",
                                     range = "A3:D16")

victims_pps <- read_excel(temp_file,
                                    sheet = "Table 6B",
                                    range = "A3:F13")
