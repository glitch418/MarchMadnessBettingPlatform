FROM openjdk:17-slim
WORKDIR /app

# Ensure database directory exists
RUN mkdir -p /app/database

# Copy Java source code
COPY BackendMain.java .
COPY database/ /app/database/
COPY database/mysql-connector-j-9.2.0.jar /app/lib/

COPY 2024_game_results/march_madness_mens_games_2024.csv /app/march_madness_mens_games_2024.csv 
COPY 2024_game_results/teams_mapping.csv /app/teams_mapping.csv

# Install required dependencies
RUN apt-get update && apt-get install -y wget curl

# Compile the Java application
RUN javac -d /app BackendMain.java
RUN javac -d /app /app/database/InsertTeams.java  
RUN javac -d /app /app/database/InsertGames.java

## Download MySQL Connector (redundant conflict)
# RUN wget -O mysql-connector-java-8.3.0.jar https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar

# Run the compiled Java application and insert teams into the database
CMD java -cp /app:/app/lib/mysql-connector-j-9.2.0.jar database.InsertTeams && java BackendMain

## Compile Java program (redundant conflict)
# RUN javac -cp ".:mysql-connector-java-8.3.0.jar" BackendMain.java

## Run backend server (redundant conflict)
# CMD ["java", "-cp", ".:mysql-connector-java-8.3.0.jar", "BackendMain"]
