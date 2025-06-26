# Click Source button or press Ctrl + Shift +S

# Libraries
library(quarto)
library(here)

# Run to render website
quarto_render(input = paste0(here(), "/pages/index.qmd"),
              as_job = FALSE)


# After render is complete run this to see output in browser
browseURL(paste0(here(), "/docs/index.html"))
