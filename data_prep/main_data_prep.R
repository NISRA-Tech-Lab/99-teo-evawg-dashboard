library(here)
source(paste0(here(), "/config.R"))

# READ IN THE DATA

nilt_currentyr_data <- read.spss(
  paste0(here(), "/data/NILT23TEOv2.sav"),
  to.data.frame = TRUE
)

nilt_previousyr_data <- read.spss(
  paste0(here(), "/data/nilt22w1.sav"),
  to.data.frame = TRUE
)

nilt_historical_chart1 <- read_excel(
  paste0(here(), "/data/nilt_historical_chart1.xlsx")
)

nilt_historical_chart2 <- read_excel(
  paste0(here(), "/data/nilt_historical_chart2.xlsx")
)

ylt_currentyr_data <- read.spss(
  paste0(here(), "/data/YLT2024.sav"),
  to.data.frame = TRUE
)

ylt_previousyr_data <- read.spss(
  paste0(here(), "/data/ylt23w1.sav"),
  to.data.frame = TRUE
)

ylt_historical_data <- read_excel(
  paste0(here(), "/data/ylt_historical.xlsx")
)



################################################################################

# ADD CURRENT YEAR'S EXPERIENCED VIOLENCE % FIGURES TO nilt_historical_chart1 DATA FILE

# Step 1: Reshape the data into long format and retain weights
nilt_currentyr_data_long <- nilt_currentyr_data %>%
  select(WTFACTOR, GBVPHYVA, GBVSEXVA, GBVPSYVA, GBVECONV, GBVONLV) %>%
  pivot_longer(cols = -WTFACTOR, names_to = "Variable", values_to = "Response") %>%
  filter(Response %in% c("Yes", "No")) %>%  # Only keep Yes/No responses
  mutate(Response = as.character(Response))

# Step 2: Calculate weighted totals for Yes and No responses
nilt_currentyr_percent <- nilt_currentyr_data_long %>%
  group_by(Variable, Response) %>%
  summarise(WeightSum = sum(WTFACTOR, na.rm = TRUE), .groups = "drop") %>%
  complete(Response = c("Yes", "No"), Variable, fill = list(WeightSum = 0)) %>%
  pivot_wider(names_from = Response, values_from = WeightSum) %>%
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

# ADD CURRENT YEAR'S % FIGURES TO nilt_historical_chart2 DATA FILE

# Weighted version of nilt_variable_by_gender
nilt_variable_by_gender <- function(df, var, gender_var = "RSEX", weight_var = "WTFACTOR") {
  df %>%
    filter(
      !is.na(.data[[var]]),
      !is.na(.data[[gender_var]]),
      .data[[var]] %in% c("Yes", "No"),
      !is.na(.data[[weight_var]])
    ) %>%
    mutate(
      weight = .data[[weight_var]],
      is_yes = ifelse(.data[[var]] == "Yes", 1, 0)
    ) %>%
    group_by(.data[[gender_var]]) %>%
    summarise(
      weighted_yes = sum(weight * is_yes, na.rm = TRUE),
      weighted_total = sum(weight, na.rm = TRUE),
      percentage_yes = round(100 * weighted_yes / weighted_total, 1),
      .groups = "drop"
    ) %>%
    mutate(variable = var)
}

# List of variables of interest
nilt_vars <- c("GBVPHYVA", "GBVSEXVA", "GBVPSYVA", "GBVECONV", "GBVONLV")

# Apply weighted function across variables
nilt_gender_data <- bind_rows(
  lapply(nilt_vars, function(v) nilt_variable_by_gender(nilt_currentyr_data, v))
)

# Final formatting
nilt_gender_data$year <- nilt_currentyear

nilt_gender_data <- nilt_gender_data %>%
  select(year, variable, RSEX, percentage_yes) %>%
  rename(gender = RSEX)

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

