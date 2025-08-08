library(here)
source(paste0(here(), "/config.R"))



# READ IN THE DATA

# URL being functioned and saved onto a temp file
# pps_url <-"https://www.ppsni.gov.uk/files/ppsni/2024-06/PPS%20Statistical%20Bulletin%202023_24%20Tables.xlsx"
# temp_file <- tempfile(fileext = ".xlsx")
# 
# # Download the file using httr::GET
# GET(pps_url,
#     write_disk(temp_file,
#                overwrite = TRUE),
#     httr::config(ssl_verifypeer = FALSE))
# 
# # Create a data frame for the data in the temp file
# files_received_pps <- read_excel(temp_file,
#                                      sheet = "Table 1B",
#                                      range = "A3:D15")
# 
# victims_pps <- read_excel(temp_file,
#                                     sheet = "Table 6B",
#                                     range = "A3:F13")
# 
# # Define URL and temp file
# pps_url <- "https://www.justice-ni.gov.uk/sites/default/files/publications/justice/202324%20case%20processing%20time%20tables%20-%20%20open%20data%20format.ods"
# temp_file <- tempfile(fileext = ".ods")
# 
# # Download the file
# GET(pps_url, write_disk(temp_file, overwrite = TRUE))
# 
# # Now read the .ods file from disk
# time_taken_pps <- read_ods(temp_file, sheet = "5", range = "A4:G17")

pps_data_portal <- read.csv("https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/INDPRCASEEQ/CSV/1.0/en")

time_taken_pps <- pps_data_portal %>% 
  filter(Financial.year %in% c("2019/20", "2020/21", "2021/22", "2022/23", "2023/24") & grepl("Offence category", Equality.Groups)) %>% 
  mutate(Equality.Groups = str_sub(Equality.Groups, unlist(gregexpr("-", Equality.Groups)) + 2, nchar(Equality.Groups))) %>% 
  pivot_wider(id_cols = Equality.Groups,
              names_from = Financial.year,
              values_from = VALUE,
              names_glue = "Median Days taken in {Financial.year}")

################################################################################
### CHART 3 DATA PREP FOR PPS (Median time taken for cases to be dealt with at courts by offence type) 

# Select and rename columns
pps_chart3_data <- time_taken_pps[, c(1, ncol(time_taken_pps))]
colnames(pps_chart3_data) <- c("offence", "days")

# Sort the data frame by descending 'days'
pps_chart3_data <- pps_chart3_data[order(pps_chart3_data$days, decreasing = TRUE), ]

# Make 'offence' a character column (preserves order in plotly)
pps_chart3_data$offence <- as.character(pps_chart3_data$offence)

# Create hover text
pps_chart3_data$hover_text <- paste0(pps_chart3_data$offence, ": ", pps_chart3_data$days, " days")

# Add spaces to end of the offences so that y axis labels aren't too close to y axis.
pps_chart3_data$offence <- paste0(pps_chart3_data$offence, "  ")


