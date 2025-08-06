library(here)
source(paste0(here(), "/config.R"))

# READ IN THE DATA

nilt_currentyr_data <- read.spss(
  paste0(data_folder, "/NILT23TEOv2.sav"),
  to.data.frame = TRUE
) %>%
  mutate(
    RAGE_num = as.numeric(as.character(RAGE)),
    age_18_29 = ifelse(RAGE_num >= 18 & RAGE_num <= 29, "yes", "no")
  )

nilt_previousyr_data <- read.spss(
  paste0(data_folder, "/NILT 2022.sav"),
  to.data.frame = TRUE
) %>%
  mutate(
    RAGE_num = as.numeric(as.character(RAGE)),
    age_18_29 = ifelse(RAGE_num >= 18 & RAGE_num <= 29, "yes", "no")
  )


nilt_historical_chart1 <- read_excel(
  paste0(data_folder, "/nilt_historical_chart1.xlsx")
)

nilt_historical_chart2 <- read_excel(
  paste0(data_folder, "/nilt_historical_chart2.xlsx")
)

nilt_historical_chart3 <- read_excel(
  paste0(data_folder, "/nilt_historical_chart3.xlsx")
) %>% mutate(age = case_when(age == "Whole population" ~ "All respondents",
                             TRUE ~ age))

ylt_currentyr_data <- read.spss(
  paste0(data_folder, "/YLT2024.sav"),
  to.data.frame = TRUE
)

ylt_previousyr_data <- read.spss(
  paste0(data_folder, "/ylt23w1.sav"),
  to.data.frame = TRUE
)

ylt_historical_chart1 <- read_excel(
  paste0(data_folder, "/ylt_historical_chart1.xlsx")
)

ylt_historical_chart2 <- read_excel(
  paste0(data_folder, "/ylt_historical_chart2.xlsx")
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
# ADD PREVIOUS YEAR'S % FIGURES TO nilt_historical_chart3 DATA FILE

# Weighted function by age group
# nilt_variable_by_age <- function(df, var, age_var = "age_18_29", weight_var = "WTFACTOR") {
#   df_filtered <- df %>%
#     filter(
#       !is.na(.data[[var]]),
#       .data[[var]] %in% c("Yes", "No"),
#       !is.na(.data[[weight_var]])
#     ) %>%
#     mutate(
#       weight = .data[[weight_var]],
#       is_yes = ifelse(.data[[var]] == "Yes", 1, 0)
#     )
# 
#   # For age group 18-29
#   age_18_29 <- df_filtered %>%
#     filter(.data[[age_var]] == "yes") %>%
#     summarise(
#       weighted_yes = sum(weight * is_yes, na.rm = TRUE),
#       weighted_total = sum(weight, na.rm = TRUE),
#       percentage_yes = round(100 * weighted_yes / weighted_total, 1)
#     ) %>%
#     mutate(age = "Age 18-29", variable = var)
# 
#   # For all age groups
#   age_all <- df_filtered %>%
#     summarise(
#       weighted_yes = sum(weight * is_yes, na.rm = TRUE),
#       weighted_total = sum(weight, na.rm = TRUE),
#       percentage_yes = round(100 * weighted_yes / weighted_total, 1)
#     ) %>%
#     mutate(age = "Whole Population", variable = var)
# 
#   bind_rows(age_18_29, age_all)
# }
# 
# # List of variables of interest
# nilt_vars <- c("GBVPHYV", "GBVSEXV", "GBVPSYV", "GBVECONV", "GBVONLV")
# 
# # Apply across variables
# nilt_age_data <- bind_rows(
#   lapply(nilt_vars, function(v) nilt_variable_by_age(nilt_previousyr_data, v))
# )
# 
# # Add year column
# nilt_age_data$year <- nilt_currentyear-1
# 
# # Final formatting
# nilt_age_data <- nilt_age_data %>%
#   select(year, variable, age, percentage_yes)
# 
# # Remove existing current year data
# nilt_historical_chart3 <- nilt_historical_chart3 %>%
#   filter(year < nilt_currentyear-1)
# 
# # Ensure 'variable' column exists and is character
# if (!"variable" %in% names(nilt_historical_chart3)) {
#   nilt_historical_chart3$variable <- as.character(NA)
# } else {
#   nilt_historical_chart3$variable <- as.character(nilt_historical_chart3$variable)
# }
# 
# # Ensure 'age' column exists and is character
# if (!"age" %in% names(nilt_historical_chart3)) {
#   nilt_historical_chart3$age <- as.character(NA)
# } else {
#   nilt_historical_chart3$age <- as.character(nilt_historical_chart3$age)
# }
# 
# # Append current year data
# updated_historical_data <- bind_rows(nilt_historical_chart3, nilt_age_data)
# 
# # Write to Excel file
# write_xlsx(updated_historical_data,  paste0(here(), "/data/nilt_historical_chart3.xlsx"))
# 
# # Reload to verify
# nilt_historical_chart3 <- read_excel(
#   paste0(here(), "/data/nilt_historical_chart3.xlsx")
# )



# ADD CURRENT YEAR'S % FIGURES TO nilt_historical_chart3 DATA FILE

# Weighted function by age group
nilt_variable_by_age <- function(df, var, age_var = "age_18_29", weight_var = "WTFACTOR") {
  df_filtered <- df %>%
    filter(
      !is.na(.data[[var]]),
      .data[[var]] %in% c("Yes", "No"),
      !is.na(.data[[weight_var]])
    ) %>%
    mutate(
      weight = .data[[weight_var]],
      is_yes = ifelse(.data[[var]] == "Yes", 1, 0)
    )
  
  # For age group 18-29
  age_18_29 <- df_filtered %>%
    filter(.data[[age_var]] == "yes") %>%
    summarise(
      weighted_yes = sum(weight * is_yes, na.rm = TRUE),
      weighted_total = sum(weight, na.rm = TRUE),
      percentage_yes = round(100 * weighted_yes / weighted_total, 1)
    ) %>%
    mutate(age = "Age 18-29", variable = var)
  
  # For all age groups
  age_all <- df_filtered %>%
    summarise(
      weighted_yes = sum(weight * is_yes, na.rm = TRUE),
      weighted_total = sum(weight, na.rm = TRUE),
      percentage_yes = round(100 * weighted_yes / weighted_total, 1)
    ) %>%
    mutate(age = "All respondents", variable = var)
  
  bind_rows(age_18_29, age_all)
}

# List of variables of interest
nilt_vars <- c("GBVPHYVA", "GBVSEXVA", "GBVPSYVA", "GBVECONV", "GBVONLV")

# Apply across variables
nilt_age_data <- bind_rows(
  lapply(nilt_vars, function(v) nilt_variable_by_age(nilt_currentyr_data, v))
)

# Add year column
nilt_age_data$year <- nilt_currentyear

# Final formatting
nilt_age_data <- nilt_age_data %>%
  select(year, variable, age, percentage_yes)

# Remove existing current year data
nilt_historical_chart3 <- nilt_historical_chart3 %>%
  filter(year < nilt_currentyear)

# Ensure 'variable' column exists and is character
if (!"variable" %in% names(nilt_historical_chart3)) {
  nilt_historical_chart3$variable <- as.character(NA)
} else {
  nilt_historical_chart3$variable <- as.character(nilt_historical_chart3$variable)
}

# Ensure 'age' column exists and is character
if (!"age" %in% names(nilt_historical_chart3)) {
  nilt_historical_chart3$age <- as.character(NA)
} else {
  nilt_historical_chart3$age <- as.character(nilt_historical_chart3$age)
}

# Append current year data
updated_historical_data <- bind_rows(nilt_historical_chart3, nilt_age_data)

# Write to Excel file
write_xlsx(updated_historical_data,  paste0(here(), "/data/nilt_historical_chart3.xlsx"))

# Reload to verify
nilt_historical_chart3 <- read_excel(
  paste0(here(), "/data/nilt_historical_chart3.xlsx")
)



################################################################################

# ADD PREVIOUS YEAR'S EXPERIENCED VIOLENCE % FIGURES TO ylt_historical_chart1 DATA FILE

# # Build initial long response data (excluding NA)
# ylt_previousyr_data_long <- ylt_previousyr_data %>%
#   select(GVTYPV1, GVTYPV2, GVTYPV3, GVTYPV4) %>%
#   pivot_longer(everything(), names_to = "Variable", values_to = "Response") %>%
#   filter(!is.na(Response)) %>%
#   mutate(Response = as.character(Response))
# 
# # Calculate counts (Ticked/Not ticked) and experienced violence percent directly
# ylt_previousyr_percent <- ylt_previousyr_data_long %>%
#   count(Variable, Response, name = "Count") %>%
#   complete(Response = c("Ticked", "Not ticked"), Variable, fill = list(Count = 0)) %>%
#   pivot_wider(names_from = Response, values_from = Count) %>%
#   mutate(Percent = (Ticked / (Ticked + `Not ticked`)) * 100) %>%
#   select(Variable, Percent) %>%
#   pivot_wider(names_from = Variable, values_from = Percent) %>%
#   mutate(year = ylt_currentyear-1) %>%
#   select(year, everything())
# 
# # Remove existing previous year data
# ylt_historical_chart1 <- ylt_historical_chart1 %>%
#   filter(year < ylt_currentyear-1)
# 
# # Append and write updated historical data
# updated_historical_data <- bind_rows(ylt_historical_chart1, ylt_previousyr_percent)
# 
# write_xlsx(updated_historical_data, paste0(here(), "/data/ylt_historical_chart1.xlsx"))
# 
# ylt_historical_chart1 <- read_excel(
#   paste0(here(), "/data/ylt_historical_chart1.xlsx")
# )


# ADD CURRENT YEAR'S EXPERIENCED VIOLENCE % FIGURES TO ylt_historical_chart1 DATA FILE

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
ylt_historical_chart1 <- ylt_historical_chart1 %>%
  filter(year < ylt_currentyear)

# Append and write updated historical data
updated_historical_data <- bind_rows(ylt_historical_chart1, ylt_currentyr_percent)

write_xlsx(updated_historical_data, paste0(here(), "/data/ylt_historical_chart1.xlsx"))

ylt_historical_chart1 <- read_excel(
  paste0(here(), "/data/ylt_historical_chart1.xlsx")
)

################################################################################

# ADD CURRENT YEAR'S % FIGURES TO ylt_historical_chart2 DATA FILE

ylt_variable_by_gender <- function(df, var, gender_var = "RSEX") {
  df %>%
    filter(
      !is.na(.data[[var]]),
      !is.na(.data[[gender_var]]),
      .data[[gender_var]] %in% c("Male", "Female"),
      .data[[var]] %in% c("Ticked", "Not Ticked")
    ) %>%
    group_by(.data[[gender_var]]) %>%
    summarise(
      ticked = sum(.data[[var]] == "Ticked"),
      total = n(),
      percentage_yes = round(100 * ticked / total, 1),
      .groups = "drop"
    ) %>%
    mutate(variable = var)
}

# Define the relevant YLT variables
ylt_vars <- c("GVTYPV1", "GVTYPV2", "GVTYPV3", "GVTYPV4")

# Apply the function across all variables and bind results
ylt_gender_data <- bind_rows(
  lapply(ylt_vars, function(v) ylt_variable_by_gender(ylt_currentyr_data, v))
)

# Add year and format the final dataframe
ylt_gender_data$year <- ylt_currentyear

ylt_gender_data <- ylt_gender_data %>%
  select(year, variable, RSEX, percentage_yes) %>%
  rename(
    gender = RSEX
  )


# Remove existing current year data
ylt_historical_chart2 <- ylt_historical_chart2 %>%
  filter(year < ylt_currentyear)

# Ensure 'variable' column exists and is character
if (!"variable" %in% names(ylt_historical_chart2)) {
  ylt_historical_chart2$variable <- as.character(NA)
} else {
  ylt_historical_chart2$variable <- as.character(ylt_historical_chart2$variable)
}

# Ensure 'gender' column exists and is character
if (!"gender" %in% names(ylt_historical_chart2)) {
  ylt_historical_chart2$gender <- as.character(NA)
} else {
  ylt_historical_chart2$gender <- as.character(ylt_historical_chart2$gender)
}

# Append and write updated historical data
updated_historical_data <- bind_rows(ylt_historical_chart2, ylt_gender_data)

write_xlsx(updated_historical_data, paste0(here(), "/data/ylt_historical_chart2.xlsx"))

ylt_historical_chart2 <- read_excel(
  paste0(here(), "/data/ylt_historical_chart2.xlsx")
)

