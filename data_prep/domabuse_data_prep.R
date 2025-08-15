library(here)
source(here("config.R"))

################################################################################
# DOMESTIC ABUSE: CHART 1 (DATA FROM DATA PORTAL)

# Step 1: Read CSV data from data portal
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

# Step 5: Fix NA values for Incidents in 2005/06 and 2006/07
DA_chart1_data$Incidents[DA_chart1_data$Year == "2005/06"] <- 23059
DA_chart1_data$Incidents[DA_chart1_data$Year == "2006/07"] <- 23456

# Step 6: Add a new row for 2004/05 with Incidents and Crimes values
new_row <- data.frame(
  Year = "2004/05",
  Incidents = 20959,
  Crimes = 9647
)

DA_chart1_data <- rbind(new_row, DA_chart1_data) 

################################################################################
# DOMESTIC ABUSE: CHART 2

# Step 1: Define and download the Excel file
DA_chart2_url <- "https://www.psni.police.uk/system/files/2025-05/386082373/Domestic%20Abuse%20Tables%20Period%20Ending%2031st%20March%202025.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

GET(DA_chart2_url,
    write_disk(temp_file, overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))

# Step 2: Read in the relevant worksheet and range
DA_chart2_data <- read_excel(temp_file,
                             sheet = "Table 1 and Figures 5 & 6",
                             range = "A5:C15")

# Step 3: Drop the previous year column
DA_chart2_data <- DA_chart2_data[, -2]

# Step 4: Rename columns
colnames(DA_chart2_data) <- c("Crime Type", "Count")

# Step 5: Extract the total value
total <- DA_chart2_data$Count[DA_chart2_data$`Crime Type` == "Total crime (domestic abuse motivation)"]

# Step 6: Add Percentage column
DA_chart2_data <- DA_chart2_data %>%
  mutate(Percentage = round((Count / total) * 100, 0))

# Step 7: Clean up label replacements
DA_chart2_data$`Crime Type`[4] <- "Stalking and Harassment"
DA_chart2_data$`Crime Type`[2] <- "Violence with injury [Note 1]"

# Step 8: Drop the first and last rows 
DA_chart2_data <- DA_chart2_data[-c(1, 10), ]

# Step 9: Recode and combine using case_when
DA_chart2_data <- DA_chart2_data %>%
  mutate(`Crime Type` = case_when(
    `Crime Type` %in% c("Theft (including burglary)",
                        "Criminal damage",
                        "Breach of non-molestation order",
                        "All other offences") ~ "All other offences",
    TRUE ~ `Crime Type`
  )) %>%
  group_by(`Crime Type`) %>%
  summarise(
    Count = sum(Count, na.rm = TRUE),
    Percentage = sum(Percentage, na.rm = TRUE),
    .groups = "drop"
  ) %>%
  arrange(desc(Count)) %>% 
  slice(c(setdiff(1:nrow(.), grep("All other offences", .$`Crime Type`)), grep("All other offences", .$`Crime Type`)))


################################################################################
# DOMESTIC ABUSE: CHART 3

# URL being functioned and saved onto a temp file
DA_chart3_url <- "https://www.justice-ni.gov.uk/sites/default/files/publications/justice/experience%20of%20domestic%20abuse%20findings%20from%20the%20201819%20niscs.xl_.XLSX"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(DA_chart3_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))


# Create a data frame for the data in the temp file
lifetime_data <- read_excel(temp_file,
                                     sheet = "Table_1",
                                     range = "B5:D6")

last3years_data <- read_excel(temp_file,
                              sheet = "Table_5",
                              range = "B5:D6")

# Add the 'category' column to each dataframe
lifetime_data$category <- "Lifetime"
last3years_data$category <- "Last Three Years"

# Combine the dataframes into a new dataframe
DA_chart3_data <- rbind(lifetime_data, last3years_data)

# Convert to long format data
DA_chart3_data <- DA_chart3_data %>%
  pivot_longer(cols = c(Men, Women, `All Adults`),
               names_to = "Group",
               values_to = "Percentage")

# Round all numeric columns to 1dp
DA_chart3_data <- DA_chart3_data %>%
  mutate(across(where(is.numeric), ~ round(.x, 1)))






