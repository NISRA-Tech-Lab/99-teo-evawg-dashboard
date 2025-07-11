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
                                     range = "A3:D15")

victims_pps <- read_excel(temp_file,
                                    sheet = "Table 6B",
                                    range = "A3:F13")


# Define URL and temp file
pps_url <- "https://www.justice-ni.gov.uk/sites/default/files/publications/justice/202324%20case%20processing%20time%20tables%20-%20%20open%20data%20format.ods"
temp_file <- tempfile(fileext = ".ods")

# Download the file
GET(pps_url, write_disk(temp_file, overwrite = TRUE))

# Now read the .ods file from disk
time_taken_pps <- read_ods(temp_file, sheet = "5", range = "A4:G17")



################################################################################
### CHART 1 DATA PREP FOR PPS (FILES RECEIVED PIE CHART) 

pps_chart1_data <- files_received_pps %>%
  mutate(classification_group = case_when(
    `Offence Classification 2` == "Violence against the person" ~ "Violence against the person",
    `Offence Classification 2` == "Sexual Offences" ~ "Sexual Offences",
    TRUE ~ "All other file classifications"
  )) %>%
  group_by(classification_group) %>%
  summarise(
    `count` = sum(`2023/24 (Number)`, na.rm = TRUE),
    .groups = "drop"
  ) %>%
  mutate(
    `percent` = round(100 * `count` / sum(`count`), 1)
  ) 

################################################################################
### CHART 2 DATA PREP FOR PPS (MALE/FEMALE VICTIMS FILES RECEIVED PIE CHART) 
pps_chart2_data <- victims_pps[nrow(victims_pps), 2:3]

# Calculate total
total <- sum(pps_chart2_data)

# Add percentage columns
pps_chart2_data$Female_percent <- round((pps_chart2_data$Female / total) * 100, 2)
pps_chart2_data$Male_percent   <- round((pps_chart2_data$Male / total) * 100, 2)

################################################################################
### CHART 3 DATA PREP FOR PPS (Median time taken for cases to be dealt with at courts by offence type) 

# Select and rename columns
pps_chart3_data <- time_taken_pps[, c(1, ncol(time_taken_pps) - 1)]
colnames(pps_chart3_data) <- c("offence", "days")

# Sort the data frame by descending 'days'
pps_chart3_data <- pps_chart3_data[order(pps_chart3_data$days, decreasing = TRUE), ]

# Make 'offence' a character column (preserves order in plotly)
pps_chart3_data$offence <- as.character(pps_chart3_data$offence)

# Create hover text
pps_chart3_data$hover_text <- paste0(pps_chart3_data$offence, ": ", pps_chart3_data$days)
