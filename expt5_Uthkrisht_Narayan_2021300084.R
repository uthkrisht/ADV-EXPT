# Load necessary libraries
library(ggplot2)
library(dplyr)
library(wordcloud)
library(RColorBrewer)
library(scatterplot3d)

# Read the dataset
housing_data <- read.csv('c:\\Users\\uth\\Desktop\\expt5\\Bangalore.csv')

# Word Cloud for locations
word_freq <- as.data.frame(table(housing_data$Location))
wordcloud(words = word_freq$Var1, freq = word_freq$Freq, min.freq = 1, scale = c(4, 0.5),
          colors = brewer.pal(8, "Paired"), random.order = FALSE)

# Box Plot of Price by Number of Bedrooms
box_plot <- ggplot(housing_data, aes(x = as.factor(No..of.Bedrooms), y = Price, fill = as.factor(No..of.Bedrooms))) +
  geom_boxplot(outlier.shape = NA) +
  labs(title = 'Box and Whisker Plot of House Prices by Number of Bedrooms', y = 'Price', x = 'Number of Bedrooms') +
  theme_minimal()

print(box_plot)

# Violin Plot of Area by Number of Bedrooms
violin_plot <- ggplot(housing_data, aes(x = as.factor(No..of.Bedrooms), y = Area, fill = as.factor(No..of.Bedrooms))) +
  geom_violin() +
  labs(title = 'Violin Plot of House Area by Number of Bedrooms', y = 'Area (sq. ft.)', x = 'Number of Bedrooms') +
  theme_minimal()

print(violin_plot)

# Scatter Plot with Linear and Nonlinear Regression
scatter_plot <- ggplot(housing_data, aes(x = Area, y = Price)) +
  geom_point(color = 'blue', alpha = 0.5) +
  geom_smooth(method = 'lm', color = 'red', se = FALSE) +  # Linear Regression
  geom_smooth(method = 'loess', color = 'green', se = FALSE) +  # Nonlinear Regression
  labs(title = 'Scatter Plot of Price vs Area with Linear and Nonlinear Regression', x = 'Area (sq. ft.)', y = 'Price') +
  theme_minimal()

print(scatter_plot)

# 3D Plot of Price, Area, and Number of Bedrooms
s3d <- scatterplot3d(housing_data$Area, housing_data$No..of.Bedrooms, housing_data$Price,
                     color = 'blue', pch = 16, angle = 55,
                     main = '3D Plot of Price, Area, and Bedrooms',
                     xlab = 'Area (sq. ft.)', ylab = 'Number of Bedrooms', zlab = 'Price')

# Jitter Plot of Price by Location
jitter_plot <- ggplot(housing_data, aes(x = Location, y = Price)) +
  geom_jitter(color = 'darkblue', width = 0.2, alpha = 0.5) +
  labs(title = 'Jitter Plot of House Prices by Location', y = 'Price', x = 'Location') +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 90, hjust = 1))

print(jitter_plot)
