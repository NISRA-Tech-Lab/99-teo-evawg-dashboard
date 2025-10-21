# Click Source button or press Ctrl + Shift +S

# Libraries
library(quarto)
library(here)

# Run to render website

quarto_render(input = here("pages/focus_on_women.qmd"),
              as_job = FALSE)



# After render is complete run this to see output in browser
browseURL(here("docs/index.html"))
