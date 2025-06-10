library(here)
source(paste0(here(), "/config.R"))

# READ IN THE DATA

nilt_historical_chart1 <- read_excel(
  paste0(here(), "/data/nilt_historical_chart1.xlsx")
)

nilt_historical_chart2 <- read_excel(
  paste0(here(), "/data/nilt_historical_chart2.xlsx")
)

ylt_historical_data <- read_excel(
  paste0(here(), "/data/ylt_historical.xlsx")
)

nilt_previousyr_data <- read.spss(
  paste0(here(), "/data/nilt22w1.sav"),
  to.data.frame = TRUE
)

nilt_currentyr_data <- read.spss(
  paste0(here(), "/data/NILT23TEOv2.sav"),
  to.data.frame = TRUE
)

ylt_previousyr_data <- read.spss(
  paste0(here(), "/data/ylt23w1.sav"),
  to.data.frame = TRUE
)

ylt_currentyr_data <- read.spss(
  paste0(here(), "/data/YLT2024.sav"),
  to.data.frame = TRUE
)


################################################################################

# ADD CURRENT YEAR'S EXPERIENCED VIOLENCE % FIGURES TO HISTORICAL NILT DATA FILE

# Build initial long response data (excluding NA)
nilt_currentyr_data_long <- nilt_currentyr_data %>%
  select(GBVPHYVA, GBVSEXVA, GBVPSYVA, GBVECONV, GBVONLV) %>%
  pivot_longer(everything(), names_to = "Variable", values_to = "Response") %>%
  filter(!is.na(Response)) %>%
  mutate(Response = as.character(Response))

# Calculate counts (Yes/No) and experienced violence perc directly
nilt_currentyr_percent <- nilt_currentyr_data_long %>%
  count(Variable, Response, name = "Count") %>%
  complete(Response = c("Yes", "No"), Variable, fill = list(Count = 0)) %>%
  pivot_wider(names_from = Response, values_from = Count) %>%
  mutate(Percent = (Yes / (Yes + No)) * 100) %>%
  select(Variable, Percent) %>%
  pivot_wider(names_from = Variable, values_from = Percent) %>%
  mutate(year = nilt_currentyear) %>%
  select(year, everything())

# Remove existing current year data
nilt_historical_chart1 <- nilt_historical_chart1 %>%
  filter(year < nilt_currentyear)

# Append and write updated historical data
updated_historical_data <- bind_rows(nilt_historical_chart1, nilt_currentyr_percent)

write_xlsx(updated_historical_data, paste0(here(), "/data/nilt_historical_chart1.xlsx"))

nilt_historical_chart1 <- read_excel(
  paste0(here(), "/data/nilt_historical_chart1.xlsx")
)

################################################################################

# Build initial long response data (excluding NA)
ylt_currentyr_data_long <- ylt_currentyr_data %>%
  select(GVTYPV1, GVTYPV2, GVTYPV3, GVTYPV4) %>%
  pivot_longer(everything(), names_to = "Variable", values_to = "Response") %>%
  filter(!is.na(Response)) %>%
  mutate(Response = as.character(Response))

# Calculate counts (Ticked/Not ticked) and experienced violence percent directly
ylt_currentyr_percent <- ylt_currentyr_data_long %>%
  count(Variable, Response, name = "Count") %>%
  complete(Response = c("Ticked", "Not Ticked"), Variable, fill = list(Count = 0)) %>%
  pivot_wider(names_from = Response, values_from = Count) %>%
  mutate(Percent = (Ticked / (Ticked + `Not Ticked`)) * 100) %>%
  select(Variable, Percent) %>%
  pivot_wider(names_from = Variable, values_from = Percent) %>%
  mutate(year = ylt_currentyear) %>%
  select(year, everything())

# Remove existing current year data
ylt_historical_data <- ylt_historical_data %>%
  filter(year < ylt_currentyear)

# Append and write updated historical data
updated_historical_data <- bind_rows(ylt_historical_data, ylt_currentyr_percent)

write_xlsx(updated_historical_data, paste0(here(), "/data/ylt_historical.xlsx"))

ylt_historical_data <- read_excel(
  paste0(here(), "/data/ylt_historical.xlsx")
)

################################################################################

# YLT CHART 1 DATA 

ylt_chart1_data <- ylt_historical_data

################################################################################


nilt_variable_by_gender <- function(df, var, gender_var = "RSEX") {
  df %>%
    filter(!is.na(.data[[var]]), !is.na(.data[[gender_var]])) %>%
    filter(.data[[var]] %in% c("Yes", "No")) %>%
    group_by(.data[[gender_var]]) %>%
    summarise(
      yes = sum(.data[[var]] == "Yes"),
      total = n(),
      percentage_yes = round(100 * yes / total, 1),
      .groups = "drop"
    ) %>%
    mutate(variable = var)
}

nilt_vars <- c("GBVPHYVA", "GBVSEXVA", "GBVPSYVA", "GBVECONV", "GBVONLV")

nilt_gender_data <- bind_rows(
  lapply(nilt_vars, function(v) nilt_variable_by_gender(nilt_currentyr_data, v))
)
nilt_gender_data$year <- nilt_currentyear

nilt_gender_data <- nilt_gender_data %>%
  select(year, variable, RSEX, percentage_yes) %>%
  rename(
    gender = RSEX
  )

# Remove existing current year data
nilt_historical_chart2 <- nilt_historical_chart2 %>%
  filter(year < nilt_currentyear)

# Ensure 'variable' column exists and is character
if (!"variable" %in% names(nilt_historical_chart2)) {
  nilt_historical_chart2$variable <- as.character(NA)
} else {
  nilt_historical_chart2$variable <- as.character(nilt_historical_chart2$variable)
}

# Ensure 'gender' column exists and is character
if (!"gender" %in% names(nilt_historical_chart2)) {
  nilt_historical_chart2$gender <- as.character(NA)
} else {
  nilt_historical_chart2$gender <- as.character(nilt_historical_chart2$gender)
}

# Append and write updated historical data
updated_historical_data <- bind_rows(nilt_historical_chart2, nilt_gender_data)

write_xlsx(updated_historical_data, paste0(here(), "/data/nilt_historical_chart2.xlsx"))

nilt_historical_chart2 <- read_excel(
  paste0(here(), "/data/nilt_historical_chart2.xlsx")
)