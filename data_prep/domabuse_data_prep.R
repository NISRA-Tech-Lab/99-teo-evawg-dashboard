library(here)
source(paste0(here(), "/config.R"))

# READ IN THE DATA

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

# renaming the columns in the data frame
colnames(domestic_abuse_inc_crime) <- c("Year", "Incidents", "Crimes")


# Convert `Years` column variable format to 04/05 from 2004/05
domestic_abuse_inc_crime$Year <- sub("^\\d{2}([0-9]{2}/[0-9]{2})$", "\\1", 
                                     domestic_abuse_inc_crime$Year)


# data prep done here for `domestic_abuse_mot_by_off`
domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off[-1, ]
domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off[-39, ]

# Rearranging row indices
rownames(domestic_abuse_mot_by_off) <- NULL

# Dropping the columns in the data frame
domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off [-c(4,5,6,7,9,10,11,12,14,
                                                           15,16,17,19,21,22,23,
                                                           26,27,28,29,31,
                                                           32,33,34), ]
# dropping last 2 columns in the data frame
domestic_abuse_mot_by_off <- domestic_abuse_mot_by_off[, -((ncol(domestic_abuse_mot_by_off)-1)
                                                           :ncol(domestic_abuse_mot_by_off))]

# URL being functioned and saved onto a temp file
types_of_da_crimes_url <- "https://www.psni.police.uk/system/files/2025-05/386082373/Domestic%20Abuse%20Tables%20Period%20Ending%2031st%20March%202025.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(types_of_da_crimes_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))

# Create a data frame for the data in the temp file
types_of_da_crimes <- read_excel(temp_file,
                                       sheet = "Table 1 and Figures 5 & 6",
                                       range = "A5:C15")
# dropping the previous year column
types_of_da_crimes <- types_of_da_crimes[, -2]

# setting column headings for the data frame
colnames(types_of_da_crimes) <- c("Crime Categories", "Count of crime recorded")


# Extract the total value
total <- types_of_da_crimes$`Count of crime recorded`[types_of_da_crimes$`Crime Categories`
                                             == "Total crime (domestic abuse motivation)"]

# Adding a new column for percentage values for crime recorded
types_of_da_crimes$Percentage <- round((types_of_da_crimes$`Count of crime recorded`
                                        / total) * 100, )

# Replacing column values in a data frame
types_of_da_crimes$`Crime Categories`[4] <- "Stalking and Harassment"

types_of_da_crimes$`Crime Categories`[2] <- "Violence with injury (including homicide and death or serious injury-unlawful driving)"




                       