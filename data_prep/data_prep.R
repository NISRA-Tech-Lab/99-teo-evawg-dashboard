library(here)
source(paste0(here(), "/config.R"))

# READ IN THE DATA

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
library(purrr)
# Select relevant data
nilt_chart1_previousyr_data <- nilt_previousyr_data %>%
  select(RSEX, GBVPHYV, GBVSEXV, GBVPSYV, GBVECONV, GBVONLV)

