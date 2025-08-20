library(here)
source(here("config.R"))

# READ IN THE DATA

################################################################################
# Read in Police Recorded Crime Chart 1 & 2 data: historical excel files plus current years data

police_recorded_crime_historical_chart1 <- read_excel(
  paste0(data_folder, "/police_recorded_crime_historical_chart1.xlsx"))

police_recorded_crime_historical_chart2 <- read_excel(
  paste0(data_folder, "/police_recorded_crime_historical_chart2.xlsx"))

# URL being functioned and saved onto a temp file
recorded_crime_url <-"https://www.psni.police.uk/system/files/2025-05/861739285/Police%20Recorded%20Crime%20Tables%20Period%20Ending%2031st%20March%202025.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(recorded_crime_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))

# Create a data frame for the data in the temp file
police_recorded_crime_chart1_currentyear <- read_excel(temp_file,
                                                       sheet = "Table 15",
                                                       range = "A3:AB186")

police_recorded_crime_chart2_currentyear <- read_excel(temp_file,
                                                       sheet = "Tables 9 & 10",
                                                       range = "A6:F15")

################################################################################
#victims page data read in
police_recorded_crime_victims <- read_excel(temp_file,
                                            sheet = "Pivot Table-Age Gender",
                                            range = "A11:E627") %>% 
  mutate(`12 months: Apr'23 to Mar'24` = NULL,
         `2024/25` = `12 months: Apr'24 to Mar'25`,
         Crime_Type = case_when(Crime_Type == "Violence with injury (incl homicide & death or serious injury - unlawful driving)" ~
                                  "Violence with injury (including homicide & death/serious injury by unlawful driving)",
                                Crime_Type == "Stalking and Harassment" ~ "Stalking and harassment",
                                TRUE ~ Crime_Type),
         .keep = "unused") %>% 
  fill(c(Victim_Age, Victim_Gender))

################################################################################
#recorded crimes policing map data

# Create a data frame for the data in the temp file
map_data <- read_excel(temp_file,
                       sheet = "Summary-District",
                       range = "A5:C375")

map_data <- map_data[c(1, 3)]

# Create dataframes for each area

# Define the break points
break_points <- c(
  "Belfast City",
  "Lisburn & Castlereagh City",
  "Ards and North Down",
  "Newry, Mourne & Down",
  "Armagh City, Banbridge & Craigavon",
  "Mid Ulster",
  "Fermanagh & Omagh",
  "Derry City & Strabane",
  "Causeway Coast & Glens",
  "Mid & East Antrim",
  "Antrim & Newtownabbey"
)

indices <- match(break_points, map_data[[1]])
end_indices <- c(indices[-1] - 1, nrow(map_data))

# Create cleaned dataframe names
df_names <- gsub("&", "and", break_points)
df_names <- tolower(df_names)
df_names <- gsub("[ ,\\-]+", "_", df_names)
df_names <- gsub("^_|_$", "", df_names)

# Slice map_data into smaller dataframes for each area
for (i in seq_along(indices)) {
  start <- indices[i]
  end   <- end_indices[i]
  df_name <- paste0(df_names[i], "_data")
  assign(df_name, map_data[start:end, ])
}


# Collect all the smaller dataframes into a named list
df_list <- list(
  belfast_city              = belfast_city_data,
  lisburn_and_castlereagh_city = lisburn_and_castlereagh_city_data,
  ards_and_north_down       = ards_and_north_down_data,
  newry_mourne_and_down     = newry_mourne_and_down_data,
  armagh_city_banbridge_and_craigavon = armagh_city_banbridge_and_craigavon_data,
  mid_ulster                = mid_ulster_data,
  fermanagh_and_omagh       = fermanagh_and_omagh_data,
  derry_city_and_strabane   = derry_city_and_strabane_data,
  causeway_coast_and_glens  = causeway_coast_and_glens_data,
  mid_and_east_antrim       = mid_and_east_antrim_data,
  antrim_and_newtownabbey   = antrim_and_newtownabbey_data
)

###########################
# Build sexual_map_data
sexual_map_data <- data.frame(area = character(), value = numeric(), stringsAsFactors = FALSE)

for (area in names(df_list)) {
  df <- df_list[[area]]
  
  row_idx <- which(df[[1]] == "SEXUAL OFFENCES")
  val <- if (length(row_idx) > 0) as.numeric(df[row_idx, 2]) else NA
  
  sexual_map_data <- rbind(
    sexual_map_data,
    data.frame(area = area, value = val)
  )
}

###########################
# Build stalking_map_data
stalking_map_data <- data.frame(area = character(), value = numeric(), stringsAsFactors = FALSE)

for (area in names(df_list)) {
  df <- df_list[[area]]
  
  row_idx <- which(df[[1]] == "Stalking & Harassment")
  val <- if (length(row_idx) > 0) as.numeric(df[row_idx, 2]) else NA
  
  stalking_map_data <- rbind(
    stalking_map_data,
    data.frame(area = area, value = val)
  )
}

###########################
# Build violence_map_data
violence_map_data <- data.frame(area = character(), value = numeric(), stringsAsFactors = FALSE)

for (area in names(df_list)) {
  df <- df_list[[area]]
  
  # Get violence value
  row_idx_violence <- which(df[[1]] == "VIOLENCE AGAINST THE PERSON")
  violence_val <- if (length(row_idx_violence) > 0) as.numeric(df[row_idx_violence, 2]) else NA
  
  # Get stalking value
  row_idx_stalking <- which(df[[1]] == "Stalking & Harassment")
  stalking_val <- if (length(row_idx_stalking) > 0) as.numeric(df[row_idx_stalking, 2]) else 0
  
  # Subtract stalking from violence
  val <- if (!is.na(violence_val)) violence_val - stalking_val else NA
  
  violence_map_data <- rbind(
    violence_map_data,
    data.frame(area = area, value = val)
  )
}

###########################
# Build other_map_data
other_map_data <- data.frame(area = character(), value = numeric(), stringsAsFactors = FALSE)

# Categories to include in the sum
other_cats <- c(
  "ROBBERY",
  "THEFT OFFENCES",
  "CRIMINAL DAMAGE",
  "DRUG OFFENCES",
  "POSSESSION OF WEAPONS OFFENCES",
  "PUBLIC ORDER OFFENCES",
  "MISCELLANEOUS CRIMES AGAINST SOCIETY"
)

for (area in names(df_list)) {
  df <- df_list[[area]]
  
  # Use [[2]] to get the raw values, not a tibble
  vals <- suppressWarnings(as.numeric(df[[2]][df[[1]] %in% other_cats]))
  
  val <- if (length(vals) > 0) sum(vals, na.rm = TRUE) else NA
  
  other_map_data <- rbind(
    other_map_data,
    data.frame(area = area, value = val)
  )
}

################################################################################
# Police Recorded Crime Chart 1 data prep

#Select two needed columns
recorded_crime_chart1_data <- police_recorded_crime_chart1_currentyear[, 
              c(1, ncol(police_recorded_crime_chart1_currentyear))]

# Extract current year values
recorded_crime_stalking <- as.numeric(recorded_crime_chart1_data[
  recorded_crime_chart1_data[[1]] == "Stalking and Harassment29,30", 
  2,
  drop = TRUE
])

recorded_crime_violence_total <- as.numeric(recorded_crime_chart1_data[
  recorded_crime_chart1_data[[1]] == "TOTAL VIOLENCE AGAINST THE PERSON OFFENCES", 
  2,
  drop = TRUE
])

recorded_crime_sexual <- as.numeric(recorded_crime_chart1_data[
  recorded_crime_chart1_data[[1]] == "TOTAL SEXUAL OFFENCES10,14", 
  2,
  drop = TRUE
])

recorded_crime_other <- sum(
  as.numeric(recorded_crime_chart1_data[
    recorded_crime_chart1_data[[1]] %in% c(
      "TOTAL ROBBERY OFFENCES",
      "TOTAL THEFT OFFENCES (INCLUDING BURGLARY)",
      "TOTAL CRIMINAL DAMAGE OFFENCES",
      "TOTAL DRUG OFFENCES",
      "TOTAL PUBLIC ORDER OFFENCES",
      "TOTAL MISCELLANEOUS CRIMES AGAINST SOCIETY",
      "TOTAL POSSESSION OF WEAPONS OFFENCES"
    ),
    2,
    drop = TRUE
  ]),
  na.rm = TRUE
)

# Calculate violence excluding stalking
recorded_crime_violence_excluding_stalking <- recorded_crime_violence_total - recorded_crime_stalking

# Create current year dataframe
recorded_crime_chart1_currentyr_row_df <- data.frame(
  `Year` = rc_currentyear,
  `Stalking and Harassment` = recorded_crime_stalking,
  `Violence Against the Person (excluding stalking and harassment)` = recorded_crime_violence_excluding_stalking,
  `Sexual` = recorded_crime_sexual,
  `Other` = recorded_crime_other,  
  stringsAsFactors = FALSE,
  check.names = FALSE  
)

# Remove existing current year data
police_recorded_crime_historical_chart1 <- police_recorded_crime_historical_chart1 %>%
  filter(Year < rc_currentyear)

# Append and write updated historical data
police_recorded_crime_historical_chart1 <- rbind(
  police_recorded_crime_historical_chart1,
  recorded_crime_chart1_currentyr_row_df
)

write_xlsx(police_recorded_crime_historical_chart1, paste0(data_folder, "/police_recorded_crime_historical_chart1.xlsx"))

police_recorded_crime_historical_chart1 <- read_excel(
  paste0(data_folder, "/police_recorded_crime_historical_chart1.xlsx")
)

################################################################################
# Police Recorded Crime Chart 2 data prep

#Select two needed columns
recorded_crime_chart2_data <- police_recorded_crime_chart2_currentyear[, 
                              c(1, ncol(police_recorded_crime_chart2_currentyear))]

# Extract current year values
online_recorded_crime_stalking <- as.numeric(recorded_crime_chart2_data[
  recorded_crime_chart2_data[[1]] == "Of which: Stalking and harassment", 
  2,
  drop = TRUE
])

online_recorded_crime_violence_total <- as.numeric(recorded_crime_chart2_data[
  recorded_crime_chart2_data[[1]] == "Violence against the person", 
  2,
  drop = TRUE
])

online_recorded_crime_sexual <- as.numeric(recorded_crime_chart2_data[
  recorded_crime_chart2_data[[1]] == "Sexual offences", 
  2,
  drop = TRUE
])

online_recorded_crime_other <- sum(
  as.numeric(recorded_crime_chart2_data[
    recorded_crime_chart2_data[[1]] %in% c(
      "Burglary, robbery, theft and criminal damage",
      "Other crimes against society"),
    2,
    drop = TRUE
  ]),
  na.rm = TRUE
)

# Calculate violence excluding stalking
online_recorded_crime_violence_excluding_stalking <- online_recorded_crime_violence_total - online_recorded_crime_stalking

# Create current year dataframe
recorded_crime_chart2_currentyr_row_df <- data.frame(
  `Year` = rc_currentyear,
  `Stalking and Harassment` = online_recorded_crime_stalking,
  `Violence Against the Person (excluding stalking and harassment)` = online_recorded_crime_violence_excluding_stalking,
  `Sexual` = online_recorded_crime_sexual,
  `Other` = online_recorded_crime_other,  
  stringsAsFactors = FALSE,
  check.names = FALSE  
)

# Remove existing current year data
police_recorded_crime_historical_chart2 <- police_recorded_crime_historical_chart2 %>%
  filter(Year < rc_currentyear)

# Append and write updated historical data
police_recorded_crime_historical_chart2 <- rbind(
  police_recorded_crime_historical_chart2,
  recorded_crime_chart2_currentyr_row_df
)

write_xlsx(police_recorded_crime_historical_chart2, paste0(data_folder, "/police_recorded_crime_historical_chart2.xlsx"))

police_recorded_crime_historical_chart2 <- read_excel(
  paste0(data_folder, "/police_recorded_crime_historical_chart2.xlsx")
)

##########################################################################

# Police recorded crime - homicide chart data prep

# Create a data frame for the homicide chart data in the temp file and pivot longer
homicide_age_gender <- read_excel(temp_file,
                                  sheet = "Tables 3, 4 & 5",
                                  range = "A13:S18")

homicide_age_gender <- homicide_age_gender %>% rename(Age = ...1) %>%
  group_by(Age) %>% 
  pivot_longer(cols = -Age, names_to = "Year", values_to = "Value") %>% 
  pivot_wider(names_from = Age, values_from = Value)

##########################################################################

# Recorded crime - victims data prep

recorded_crime_historic_url <-"https://www.psni.police.uk/system/files/2025-01/444101239/Police_Recorded_Crime_in_Northern_Ireland_1998-99_to_2023-24_revised.xlsx"
temp_file <- tempfile(fileext = ".xlsx")

# Download the file using httr::GET
GET(recorded_crime_historic_url,
    write_disk(temp_file,
               overwrite = TRUE),
    httr::config(ssl_verifypeer = FALSE))

# Create a data frame for the data in the temp file
police_recorded_crime_historic_victims <- read_excel(temp_file,
                                            sheet = "Pivot Table-Victim Gender_Age",
                                            range = "A13:T629") %>% 
  fill(c(Victim_Gender, Victim_Age))

all_police_recorded_crime_victims <- left_join(police_recorded_crime_historic_victims, 
                                               police_recorded_crime_victims) %>% 
  select(-Victim_Age) %>% 
  filter(Victim_Gender != "total (gender)" & Crime_Type != "Total police recorded crime") %>% 
  group_by(Victim_Gender, Crime_Type) %>% 
  summarise(across(where(is.numeric), \(x) sum(x, na.rm = TRUE))) %>% 
  ungroup() %>% 
  mutate(across(where(is.numeric), \(x) x / sum(x) * 100)) 


all_police_recorded_crime_victims_gender_total <- left_join(police_recorded_crime_historic_victims, 
                                                     police_recorded_crime_victims)  %>% 
  select(-Victim_Age) %>%
  filter(Victim_Gender == "total (gender)"  & Crime_Type != "Total police recorded crime") %>% 
  group_by(Victim_Gender, Crime_Type) %>% 
  summarise(across(where(is.numeric), \(x) sum(x, na.rm = TRUE))) %>% 
  ungroup() %>% 
  mutate(across(where(is.numeric), \(x) x / sum(x) * 100))

all_police_recorded_crime_victims_type_total <- left_join(police_recorded_crime_historic_victims, 
                                                            police_recorded_crime_victims)  %>% 
  select(-Victim_Age) %>%
  filter(Crime_Type == "Total police recorded crime" & Victim_Gender != "total (gender)") %>% 
  group_by(Victim_Gender, Crime_Type) %>% 
  summarise(across(where(is.numeric), \(x) sum(x, na.rm = TRUE))) %>% 
  ungroup() %>% 
  mutate(across(where(is.numeric), \(x) x / sum(x) * 100))

all_police_recorded_crime_victims <- bind_rows(all_police_recorded_crime_victims, all_police_recorded_crime_victims_gender_total, all_police_recorded_crime_victims_type_total) %>%
  mutate(Crime_Type = case_when(Crime_Type == "Violence with injury (including homicide & death/serious injury by unlawful driving)" ~
                                  "Violence with injury",
                                TRUE ~ Crime_Type),
         Victim_Gender = str_to_title(Victim_Gender)) %>%
  filter(Crime_Type %in% c("Violence with injury", "Violence without injury",
                           "Stalking and harassment", "Sexual offences", "Total police recorded crime"),
         Victim_Gender %in% c("Male", "Female", "Total (Gender)")) %>%
  pivot_longer(cols = -c(Victim_Gender:Crime_Type), names_to = "Year", values_to = "Value")


##########################################################################

# Police recorded crime - policing district data













































# # URL being functioned and saved onto a temp file
# police_rec_crime_url <-"https://www.psni.police.uk/system/files/2025-01/444101239/Police_Recorded_Crime_in_Northern_Ireland_1998-99_to_2023-24_revised.xlsx"
# temp_file <- tempfile(fileext = ".xlsx")
# 
# # Download the file using httr::GET
# GET(police_rec_crime_url,
#     write_disk(temp_file,
#                overwrite = TRUE),
#     httr::config(ssl_verifypeer = FALSE))
# 
# # Create a data frame for the data in the temp file
# recorded_crime_total_chart1 <- read_excel(temp_file,
#                                      sheet = "Table 2.2",
#                                      range = "A3:AA57")
# 
# recorded_crime_victim_chart2 <- read_excel(temp_file,
#                                     sheet = "Pivot Table-Victim Gender_Age",
#                                     range = "A12:T629")
# 
# ################################################################################
# 
# # data manipulation for `recorded_crime_total_chart1` is done here
# 
# # Dropping NA's in the data frame
# recorded_crime_total_chart1 <- recorded_crime_total_chart1[-c(1,25), ]
# 
# # Selecting rows in the data frame
# recorded_crime_total_chart1 <- recorded_crime_total_chart1[c(2,13,28,40,47),]
# 
# # Converting the data frame to numeric from row 2
# recorded_crime_total_chart1 <- recorded_crime_total_chart1 %>%
#   mutate(across(2:ncol(.), as.numeric))
# 
# 
# recorded_crime_total_chart1$Offence[recorded_crime_total_chart1$Offence %in% 
#                                  c("Homicide35", "Violence with injury5,29,33,34",
#                                    "Violence without injury5,29", 
#                                    "Stalking and Harassment29,30", 
#                                    "TOTAL SEXUAL OFFENCES10,14")] <- 
#   c("Homicide", "Violence with injury",  "Violence without injury", 
#     "Stalking and Harassment", "Total Sexual Offences")
# 
# # Pivoting the data frame for sorting the categories according to years
# recorded_crime_total_chart1 <- pivot_longer(
#   recorded_crime_total_chart1,
#   cols = -Offence,         
#   names_to = "Year",      
#   values_to = "Value"       
# )
# 
# # Formating the data frame using regex pattern to match any digits before and after a slash
# recorded_crime_total_chart1 <- recorded_crime_total_chart1 %>%
#   mutate(Year = str_replace_all(Year, "(\\d+)/(\\d+)", function(x) {
#     parts <- str_match(x, "(\\d+)/(\\d+)")
#     before <- substr(parts[2], nchar(parts[2]) - 1, nchar(parts[2]))  
#     after  <- substr(parts[3], 1, 2)                                  
#     paste0(before, "/", after)
#   }))



