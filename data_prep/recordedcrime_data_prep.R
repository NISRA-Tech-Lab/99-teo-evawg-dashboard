library(here)
source(here("config.R"))

# READ IN THE DATA

################################################################################
# Read in Police Recorded Crime Chart 1 data: historical excel file plus current year data

police_recorded_crime_historical_chart1 <- read_excel(
  paste0(data_folder, "/police_recorded_crime_historical_chart1.xlsx")
)

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

# districts <- (c("Belfast", 
#                 "Lisburn and Castlereagh", 
#                 "Ards and North Down", 
#                 "Newry, Mourne and Down", 
#                 "Armagh City, Banbridge and Craigavon", 
#                 "Mid Ulster", 
#                 "Fermanagh and Omagh", 
#                 "Derry City and Strabane", 
#                 "Causeway Coast and Glens", 
#                 "Mid and East Antrim", 
#                 "Antrim and Newtownabbey"))
# 
# a_row <- 40
# 
# c_row <- 65
# 
# all_districts_data <- list()
# 
# for (district in districts) {
#   df <- read_excel(temp_file,
#                    sheet = "Summary-District",
#                    range = paste0("A", a_row, ":C", c_row)) %>%
#     mutate(LGDNAME = district,
#            Crime_Type = `...1`,
#            Crime_Type_2 = case_when(Crime_Type %in% c("Violence with injury (including homicide & death/serious injury by unlawful driving)",
#                                                      "Violence without injury") ~ "Violence against the person (excluding stalking and harassment",
#                                     Crime_Type == "Stalking & Harassment" ~ "Stalking & harassment",
#                                     Crime_Type == "SEXUAL OFFENCES" ~ "Sexual offences",
#                                     Crime_Type %in% c("VICTIM-BASED CRIME", "VIOLENCE AGAINST THE PERSON", "ROBBERY", "THEFT OFFENCES", "OTHER CRIMES AGAINST SOCIETY", "DRUG OFFENCES", "TOTAL POLICE RECORDED CRIME") ~ NA,
#                                     TRUE ~ "Other"),
#            `2024/25` = `Apr'24-Mar'25`,
#            .keep = "none") 
#   
#   all_districts_data[[district]] <- df
#   
#   a_row <- a_row + 31
#   c_row <- c_row + 31
# }
# 
# police_recorded_crime_districts <- bind_rows(all_districts_data) %>% 
#   group_by(LGDNAME, Crime_Type_2) %>% 
#   summarise(`Value` = sum(`2024/25`)) %>% 
#   filter(!is.na(Crime_Type_2)) %>% 
#   ungroup()
# 
# lgd_shape <- st_read(
#   here("maps/Simplified OSNI Map Loughs Removed.shp"),
#   quiet = TRUE
# )
# 
# map_1_data <- left_join(lgd_shape, police_recorded_crime_districts) %>% 
#   mutate(labels = prettyNum(`Value`, big.mark = ",")) %>% 
#   as("Spatial")
# 
# 
# # Add line for Belfast label
# 
# map_proj <- st_transform(map_1_data, crs = 29903) %>%
#   mutate(centroid = st_centroid(geometry))
# 
# centroid_3 <- st_coordinates(st_centroid(map_proj$geometry[3]))
# 
# label_coords <- centroid_3 + c(13000, 12000)
# 
# line_3 <- st_linestring(rbind(centroid_3, label_coords))
# leader_line_3 <- st_sf(geometry = st_sfc(line_3, crs = 29903)) %>%
#   st_transform(crs = 4326)


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



