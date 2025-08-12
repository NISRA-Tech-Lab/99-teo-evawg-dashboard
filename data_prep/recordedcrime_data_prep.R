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
recorded_crime_total_chart1 <- read_excel(temp_file,
                                     sheet = "Table 2.2",
                                     range = "A3:AA57")

recorded_crime_victim_chart2 <- read_excel(temp_file,
                                    sheet = "Pivot Table-Victim Gender_Age",
                                    range = "A12:T629")

################################################################################

# data manipulation for `recorded_crime_total_chart1` is done here

# Dropping NA's in the data frame
recorded_crime_total_chart1 <- recorded_crime_total_chart1[-c(1,25), ]

# Selecting rows in the data frame
recorded_crime_total_chart1 <- recorded_crime_total_chart1[c(2,13,28,40,47),]

# Converting the data frame to numeric from row 2
recorded_crime_total_chart1 <- recorded_crime_total_chart1 %>%
  mutate(across(2:ncol(.), as.numeric))


recorded_crime_total_chart1$Offence[recorded_crime_total_chart1$Offence %in% 
                                 c("Homicide35", "Violence with injury5,29,33,34",
                                   "Violence without injury5,29", 
                                   "Stalking and Harassment29,30", 
                                   "TOTAL SEXUAL OFFENCES10,14")] <- 
  c("Homicide", "Violence with injury",  "Violence without injury", 
    "Stalking and Harassment", "Total Sexual Offences")

# Pivoting the data frame for sorting the categories according to years
recorded_crime_total_chart1 <- pivot_longer(
  recorded_crime_total_chart1,
  cols = -Offence,         
  names_to = "Year",      
  values_to = "Value"       
)

# Formating the data frame using regex pattern to match any digits before and after a slash
recorded_crime_total_chart1 <- recorded_crime_total_chart1 %>%
  mutate(Year = str_replace_all(Year, "(\\d+)/(\\d+)", function(x) {
    parts <- str_match(x, "(\\d+)/(\\d+)")
    before <- substr(parts[2], nchar(parts[2]) - 1, nchar(parts[2]))  
    after  <- substr(parts[3], 1, 2)                                  
    paste0(before, "/", after)
  }))



