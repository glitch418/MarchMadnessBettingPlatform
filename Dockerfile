FROM openjdk:17-slim
WORKDIR /app

# Copy Java source code
COPY BackendMain.java .
<<<<<<< HEAD
COPY database/ /app/database/
COPY database/mysql-connector-j-9.2.0.jar /app/lib/

COPY 2024_game_results/march_madness_mens_games_2024.csv /app/march_madness_mens_games_2024.csv 
COPY 2024_game_results/teams_mapping.csv /app/teams_mapping.csv
=======
>>>>>>> main

# Install required dependencies
RUN apt-get update && apt-get install -y wget curl

# Download MySQL Connector
RUN wget -O mysql-connector-java-8.3.0.jar https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar

# Compile Java program
RUN javac -cp ".:mysql-connector-java-8.3.0.jar" BackendMain.java

# Run backend server
CMD ["java", "-cp", ".:mysql-connector-java-8.3.0.jar", "BackendMain"]
