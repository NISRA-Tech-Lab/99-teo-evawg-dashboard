library(here)
source(paste0(here(), "/config.R"))

# READ IN THE DATA

nilt_historical_data <- read_excel(
  paste0(here(), "/data/nilt_historical.xlsx")
)

nilt_previousyr_data <- read.spss(
  paste0(here(), "/data/nilt22w1.sav"),
  to.data.frame = TRUE
)

nilt_currentyr_data <- read.spss(
  paste0(here(), "/data/nilt23w1.sav"),
  to.data.frame = TRUE
)

ylt_previousyr_data <- read.spss(
  paste0(here(), "/data/ylt22w2.sav"),
  to.data.frame = TRUE
)

ylt_currentyr_data <- read.spss(
  paste0(here(), "/data/ylt23w1.sav"),
  to.data.frame = TRUE
)

ylt_currentyr_plus1_data <- read.spss(
  paste0(here(), "/data/ylt24.sav"),
  to.data.frame = TRUE
)

################################################################################

# Step 1: Build the initial response counts (exclude NA entirely)
chart1_previousyr_data <- nilt_previousyr_data %>%
  select(GBVPHYV, GBVSEXV, GBVPSYV, GBVECONV, GBVONLV) %>%
  pivot_longer(everything(), names_to = "Variable", values_to = "Response") %>%
  filter(!is.na(Response)) %>%      # Exclude NA values entirely at the start
  mutate(Response = as.character(Response)) %>%
  count(Response, Variable, name = "Count") %>%
  complete(Response = c("Yes", "No"), Variable, fill = list(Count = 0)) %>%
  pivot_wider(names_from = Variable, values_from = Count) %>%
  rename(GBVPHYVA = GBVPHYV,
         GBVSEXVA = GBVSEXV,
         GBVPSYVA = GBVPSYV) %>%
  arrange(factor(Response, levels = c("Yes", "No")))

# Step 2: Add total row (only Yes + No included)
total_row <- chart1_previousyr_data %>%
  select(-Response) %>%
  summarise(across(everything(), sum)) %>%
  mutate(Response = "Total") %>%
  select(Response, everything())

chart1_previousyr_data <- bind_rows(chart1_previousyr_data, total_row)

# Step 3: Calculate experienced_violence_perc (no rounding, no NA)
experienced_violence_perc <- chart1_previousyr_data %>%
  filter(Response %in% c("Yes", "No")) %>%
  pivot_longer(-Response, names_to = "Variable", values_to = "Count") %>%
  pivot_wider(names_from = Response, values_from = Count, values_fill = 0) %>%
  mutate(TotalYN = Yes + No,
         Percent = (Yes / TotalYN) * 100) %>%
  select(Variable, Percent) %>%
  pivot_wider(names_from = Variable, values_from = Percent) %>%
  mutate(Response = "experienced_violence_perc") %>%
  select(Response, everything())

# Step 4: Bind it all together
chart1_previousyr_data <- bind_rows(chart1_previousyr_data, experienced_violence_perc)


# Step 1: Build the initial response counts (exclude NA entirely)
chart1_currentyr_data <- nilt_currentyr_data %>%
  select(GBVPHYVA, GBVSEXVA, GBVPSYVA, GBVECONV, GBVONLV) %>%
  pivot_longer(everything(), names_to = "Variable", values_to = "Response") %>%
  filter(!is.na(Response)) %>%      # Exclude NA values entirely at the start
  mutate(Response = as.character(Response)) %>%
  count(Response, Variable, name = "Count") %>%
  complete(Response = c("Yes", "No"), Variable, fill = list(Count = 0)) %>%
  pivot_wider(names_from = Variable, values_from = Count) %>%
  arrange(factor(Response, levels = c("Yes", "No")))

# Step 2: Add total row (only Yes + No included)
total_row <- chart1_currentyr_data %>%
  select(-Response) %>%
  summarise(across(everything(), sum)) %>%
  mutate(Response = "Total") %>%
  select(Response, everything())

chart1_currentyr_data <- bind_rows(chart1_currentyr_data, total_row)

# Step 3: Calculate experienced_violence_perc (no rounding, no NA)
experienced_violence_perc <- chart1_currentyr_data %>%
  filter(Response %in% c("Yes", "No")) %>%
  pivot_longer(-Response, names_to = "Variable", values_to = "Count") %>%
  pivot_wider(names_from = Response, values_from = Count, values_fill = 0) %>%
  mutate(TotalYN = Yes + No,
         Percent = (Yes / TotalYN) * 100) %>%
  select(Variable, Percent) %>%
  pivot_wider(names_from = Variable, values_from = Percent) %>%
  mutate(Response = "experienced_violence_perc") %>%
  select(Response, everything())

# Step 4: Bind it all together
chart1_currentyr_data <- bind_rows(chart1_currentyr_data, experienced_violence_perc)

# Step 1: Extract experienced_violence_perc rows
prev_perc <- chart1_previousyr_data %>%
  filter(Response == "experienced_violence_perc") %>%
  select(-Response) %>%
  pivot_longer(cols = everything(), names_to = "Variable", values_to = "Prev_Percent")

curr_perc <- chart1_currentyr_data %>%
  filter(Response == "experienced_violence_perc") %>%
  select(-Response) %>%
  pivot_longer(cols = everything(), names_to = "Variable", values_to = "Curr_Percent")

# Step 2: Merge previous and current year data
chart1_perc_data <- prev_perc %>%
  left_join(curr_perc, by = "Variable") %>%
  rename(!!as.character(currentyear - 1) := Prev_Percent,
         !!as.character(currentyear) := Curr_Percent)