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
  mutate(year = currentyear) %>%
  select(year, everything())

# Remove existing current year data
nilt_historical_data <- nilt_historical_data %>%
  filter(year < currentyear)

# Append and write updated historical data
updated_historical_data <- bind_rows(nilt_historical_data, nilt_currentyr_percent)

write_xlsx(updated_historical_data, paste0(here(), "/data/nilt_historical.xlsx"))

nilt_historical_data <- read_excel(
  paste0(here(), "/data/nilt_historical.xlsx")
)
