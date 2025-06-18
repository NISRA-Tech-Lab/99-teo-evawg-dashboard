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

# # URL being functioned and saved onto a temp file
domestic_abuse_inc_crime_url <- "https://www.psni.police.uk/system/files/2025-01/1059392717/Domestic%20Abuse%20Incidents%20and%20Crimes%20in%20Northern%20Ireland%202004-05%20to%202023-24%20-%20Revised.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(domestic_abuse_inc_crime_url,
    write_disk(temp_file,
               overwrite = TRUE),
   httr::config(ssl_verifypeer = FALSE))

# Create a data frame for the data in the temp file
domestic_abuse_inc_crime <- read_excel(temp_file,
                                       sheet = "Table 1.1",
                                       range = "A6:C26")

domestic_abuse_mot_by_off <- read_excel(temp_file,
                                        sheet = "Table 2.1",
                                        range = "A4:W45")

# renaming the columns in the dataframe
colnames(domestic_abuse_inc_crime) <- c("Year", "Incidents", "Crimes")


# Convert `Years` column varaible format to 04/05 from 2004/05
domestic_abuse_inc_crime$Year <- sub("^\\d{2}([0-9]{2}/[0-9]{2})$", "\\1", 
                                     domestic_abuse_inc_crime$Year)


# data prep done here for `domestic_abuse_mot_by_off`
domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off[-1, ]
domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off[-39, ]

# Rearranging row indices
rownames(domestic_abuse_mot_by_off) <- NULL

domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off [-c(4,5,6,7,9,10,11,12,14,
                                                           15,16,17,19,21,22,23,
                                                           26,27,28,29,31,
                                                           32,33,34), ]
# dropping last 2 columns in the data frame
domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off[, -((ncol(domestic_abuse_mot_by_off)-1)
                                                           :ncol(domestic_abuse_mot_by_off))]






