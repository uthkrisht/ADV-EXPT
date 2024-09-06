library(ggplot2)
library(dplyr)

crime_data <- read.csv("43_Arrests_under_crime_against_women.csv")

if (exists("crime_data") && !is.null(crime_data) && nrow(crime_data) > 0) {
  if ("Group_Name" %in% colnames(crime_data)) {
    p1 <- ggplot(crime_data, aes(x = Group_Name)) +
      geom_bar(fill = "skyblue") +
      labs(title = "Count of Crimes by Crime Group", x = "Crime Group", y = "Number of Crimes") +
      theme_minimal()
    print(p1)
  } else {
    print("Column 'Group_Name' not found in dataset.")
  }
} else {
  print("Dataset not loaded correctly. Please check the file path and file name.")
}

crime_summary <- crime_data %>%
  group_by(Group_Name) %>%
  summarise(Count = n())

p2 <- ggplot(crime_summary, aes(x = "", y = Count, fill = Group_Name)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar(theta = "y") +
  labs(title = "Distribution of Crime Groups") +
  theme_void()
print(p2)

p3 <- ggplot(crime_data, aes(x = Persons_Arrested)) +
  geom_histogram(binwidth = 5, fill = "orange", color = "black") +
  labs(title = "Distribution of Persons Arrested", x = "Persons Arrested", y = "Frequency") +
  theme_minimal()
print(p3)

crime_data$Year <- as.Date(as.character(crime_data$Year), format="%Y")

p4 <- ggplot(crime_data, aes(x = Year)) +
  geom_line(stat="count", color="darkblue") +
  labs(title = "Trend of Crimes Over Time", x = "Year", y = "Crime Count") +
  theme_minimal()
print(p4)

p5 <- ggplot(crime_data, aes(x = Persons_Acquitted, y = Persons_Convicted)) +
  geom_point(color = "darkgreen") +
  labs(title = "Persons Convicted vs Persons Acquitted", x = "Persons Acquitted", y = "Persons Convicted") +
  theme_minimal()
print(p5)

p6 <- ggplot(crime_data, aes(x = Group_Name, y = Persons_Arrested, size = Persons_Convicted, fill = Group_Name)) +
  geom_point(alpha = 0.5) +
  labs(title = "Crime Type, Persons Arrested, and Convictions", x = "Crime Type", y = "Persons Arrested", size = "Convictions") +
  theme_minimal()
print(p6)

p7 <- ggplot(crime_data, aes(x = Group_Name, y = Persons_Arrested)) +
  geom_boxplot(fill = "lightblue") +
  labs(title = "Distribution of Persons Arrested by Crime Group", x = "Crime Group", y = "Persons Arrested") +
  theme_minimal()
print(p7)
