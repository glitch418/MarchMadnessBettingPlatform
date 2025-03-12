FROM openjdk:17

WORKDIR /app

# Ensure database directory exists
RUN mkdir -p /app/database

# Copy the backend Java file into the container
COPY BackendMain.java .
COPY database/ /app/database/
COPY database/mysql-connector-j-9.2.0.jar /app/lib/

COPY 2024_game_results/march_madness_mens_games_2024.csv /app/march_madness_mens_games_2024.csv 

# Compile the Java application
RUN javac -d /app BackendMain.java
RUN javac -d /app /app/database/InsertTeams.java  
RUN javac -d /app /app/database/InsertGames.java

# Expose the port for frontend-backend communication
EXPOSE 5000

# Run the compiled Java application and insert teams into the database
CMD java -cp /app:/app/lib/mysql-connector-j-9.2.0.jar database.InsertTeams && java BackendMain
