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
police_rec_crime <- read_excel(temp_file,
                                     sheet = "Table 2.2",
                                     range = "A3:AA57")

pivot_tab_vic_gen_age <- read_excel(temp_file,
                                    sheet = "Pivot Table-Victim Gender_Age",
                                    range = "A12:T629")

# data manipulation for `police_rec_crime` is done here

# Dropping NA's in the data frame
police_rec_crime <- police_rec_crime[-c(1,25), ]

# Selecting rows in the data frame
police_rec_crime <- police_rec_crime[c(2,13,28,40,47),]

# Converting the data frame to numeric from row 2
police_rec_crime <- police_rec_crime %>%
  mutate(across(2:ncol(.), as.numeric))


police_rec_crime$Offence[police_rec_crime$Offence %in% 
                                 c("Homicide35", "Violence with injury5,29,33,34",
                                   "Violence without injury5,29", 
                                   "Stalking and Harassment29,30", 
                                   "TOTAL SEXUAL OFFENCES10,14")] <- 
  c("Homicide", "Violence with injury",  "Violence without injury", 
    "Stalking and Harassment", "Total Sexual Offences")

# Pivoting the data frame for sorting the categories according to years
police_rec_crime <- pivot_longer(
  police_rec_crime,
  cols = -Offence,         
  names_to = "Year",      
  values_to = "Value"       
)

# Formating the data frame using regex pattern to match any digits before and after a slash
police_rec_crime <- police_rec_crime %>%
  mutate(Year = str_replace_all(Year, "(\\d+)/(\\d+)", function(x) {
    parts <- str_match(x, "(\\d+)/(\\d+)")
    before <- substr(parts[2], nchar(parts[2]) - 1, nchar(parts[2]))  # last 2 digits before slash
    after  <- substr(parts[3], 1, 2)                                  # first 2 digits after slash
    paste0(before, "/", after)
  }))



