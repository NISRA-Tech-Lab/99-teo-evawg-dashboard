library(here)
source(here("config.R"))



# READ IN THE DATA

pps_data_portal <- read.csv("https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadDataset/INDPRCASEEQ/CSV/1.0/en")

time_taken_pps <- pps_data_portal %>% 
  filter(Financial.year %in% c("2019/20", "2020/21", "2021/22", "2022/23", "2023/24") & grepl("Offence category", Equality.Groups)) %>% 
  mutate(Equality.Groups = str_sub(Equality.Groups, unlist(gregexpr("-", Equality.Groups)) + 2, nchar(Equality.Groups))) %>% 
  pivot_wider(id_cols = Equality.Groups,
              names_from = Financial.year,
              values_from = VALUE,
              names_glue = "Median Days taken in {Financial.year}")

################################################################################
### CHART 1 DATA PREP FOR PPS (Median time taken for cases to be dealt with at court) 

# Select and rename columns
pps_chart1_data <- time_taken_pps[, c(1, ncol(time_taken_pps))]
colnames(pps_chart1_data) <- c("offence", "days")

# Sort the data frame by descending 'days'
pps_chart1_data <- pps_chart1_data[order(pps_chart1_data$days, decreasing = TRUE), ]

# Make 'offence' a character column (preserves order in plotly)
pps_chart1_data$offence <- as.character(pps_chart1_data$offence)

# Create hover text
pps_chart1_data$hover_text <- paste0(pps_chart1_data$offence, ": ", pps_chart1_data$days, " days")

# Add spaces to end of the offences so that y axis labels aren't too close to y axis.
pps_chart1_data$offence <- paste0(pps_chart1_data$offence, "  ")


