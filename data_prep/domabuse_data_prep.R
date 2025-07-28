library(here)
source(paste0(here(), "/config.R"))

################################################################################
# DOMESTIC ABUSE REPORTED CRIMES: CHART 1 (DATA FROM DATA PORTAL)

# Step 1: Read CSV data from PxStat API
DA_chart1_CSV_data <- read.csv("https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/DOMDEA/CSV/1.0/en")

# Step 2: Filter for Northern Ireland only and drop unwanted columns
DA_chart1_data <- DA_chart1_CSV_data[DA_chart1_CSV_data$District.Electoral.Area == "Northern Ireland", ]
DA_chart1_data <- subset(DA_chart1_data, select = -c(STATISTIC, TLIST.A1., DEA2014, UNIT, District.Electoral.Area))

# Step 3: Pivot wider so 'Statistic.Label' values become columns
DA_chart1_data <- pivot_wider(
  DA_chart1_data,
  names_from = Statistic.Label,
  values_from = VALUE
)

# Step 4: Rename columns
colnames(DA_chart1_data) <- c("Year", "Incidents", "Crimes")

# Step 5: Add formatted y-axis year labels as a new column
DA_chart1_data$yaxis_year <- gsub("^20", "", DA_chart1_data$Year)     
DA_chart1_data$yaxis_year <- gsub("/", "/\n", DA_chart1_data$yaxis_year)

# Step 6: Fix NA values for Incidents in 2005/06 and 2006/07
DA_chart1_data$Incidents[DA_chart1_data$Year == "2005/06"] <- 23059
DA_chart1_data$Incidents[DA_chart1_data$Year == "2006/07"] <- 23456

# Step 7: Add a new row for 2004/05 with Incidents and Crimes values
new_row <- data.frame(
  Year = "2004/05",
  Incidents = 20959,
  Crimes = 9647,
  yaxis_year = gsub("/", "/\n", gsub("^20", "", "2004/05"))
)

DA_chart1_data <- rbind(new_row, DA_chart1_data) 

################################################################################
# DOMESTIC ABUSE REPORTED CRIMES: CHART 2

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
latest_data <- read_excel(temp_file,
                          sheet = "Table 6 and Figure 2",
                          range = "A61:C75")


##data prep for `types_of_da_crimes`

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

# dropping the first and last column of `types_of_da_crimes`

types_of_da_crimes <- types_of_da_crimes[-c(1, 10), ]



























# URL being functioned and saved onto a temp file
domestic_abuse_inc_crime_url <- "https://www.psni.police.uk/system/files/2025-01/1059392717/Domestic%20Abuse%20Incidents%20and%20Crimes%20in%20Northern%20Ireland%202004-05%20to%202023-24%20-%20Revised.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(domestic_abuse_inc_crime_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))


domestic_abuse_mot_by_off <- read_excel(temp_file,
                                        sheet = "Table 2.1",
                                        range = "A4:W45")



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
exp_of_da_crimes_18_19_url <- "https://www.justice-ni.gov.uk/sites/default/files/publications/justice/experience%20of%20domestic%20abuse%20findings%20from%20the%20201819%20niscs.xl_.XLSX"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(exp_of_da_crimes_18_19_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))


# Create a data frame for the data in the temp file
exp_of_da_crimes_18_19 <- read_excel(temp_file,
                                     sheet = "Table_3",
                                     range = "A5:B8")

last_3_years_da <- read_excel(temp_file,
                              sheet = "Table_5",
                              range = "A5:D10")

# Data manipulation for`exp_of_da_crimes_18_19`

# Renaming Columns
names(exp_of_da_crimes_18_19) <- c("Gender", "Percentage")

# Round the Percentage column to 1 decimal place
exp_of_da_crimes_18_19$Percentage <- round(exp_of_da_crimes_18_19$Percentage, 1)

# Data manipulation for `last_3_years_da`

# Rename one column
last_3_years_da <- last_3_years_da %>%
  rename(`Categories` = `% victims once or more, last three years`)

# Round the Percentage column to 1 decimal place for all genders
last_3_years_da$Men <- round(last_3_years_da$Men, 1)

last_3_years_da$Women <- round(last_3_years_da$Women, 1)

last_3_years_da$`All Adults` <- round(last_3_years_da$`All Adults`, 1)


# Pivot the data from wide to long format
last_3_years_da <- last_3_years_da %>%
  pivot_longer(
    cols = c(Men, Women, `All Adults`),  
    names_to = "Gender",
    values_to = "Percentage"
  )
