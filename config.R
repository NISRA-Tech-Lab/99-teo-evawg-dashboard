library(flexdashboard)
library(knitr)
library(crosstalk)
library(DT)
library(ggplot2) 
library(plotly)
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

currentyear <- 2023
nilt_currentyear <- 2023
ylt_currentyear <- 2024

##### COLOURS #####
nisra_palette <- c(
  nisra_green_decoration = "#CEDC20",
  nisra_blue = "#3878c5",
  nisra_navy = "#00205b",
  nisra_col3_green = "#68a41e", 
  nisra_col4_purple = "#732777"
)

nisra_colours <- unname(nisra_palette)

