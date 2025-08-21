library(flexdashboard)
library(knitr)
library(crosstalk)
library(DT)
library(ggplot2) 
library(stringr)
library(reshape2)
library(readxl)
library(dplyr)
library(tidyr)
library(reactable)
library(formattable) 
library(base64enc)
library(png)
library(patchwork)
library(devtools) 
library(htmltools)
library(lubridate)
library(kableExtra)
library(data.table)
library(quarto)
library(foreign)
library(writexl)
library(fs)
library(httr)
library(plotly)
library(readODS)
library(sf)
library(tmap)
library(fontawesome)

data_folder <- "T:/Projects/99 - TEO VAWG Dashboard/data"

if (!dir.exists(here("data"))) dir.create(here("data"))


currentyear <- 2023
nilt_currentyear <- 2023
ylt_currentyear <- 2024
da_currentyear <- "2024/25"
rc_currentyear <- "2024/25"


##### COLOURS #####
nisra_palette <- c(
  nisra_blue = "#3878c5",
  nisra_navy = "#00205b",
  nisra_col3_green = "#68a41e", 
  nisra_col4_purple = "#732777",
  nisra_lilac = "#ce70d2",
  nisra_olive = "#434700",
  nisra_brown = "#A88F8F"
)

nisra_colours <- unname(nisra_palette)

