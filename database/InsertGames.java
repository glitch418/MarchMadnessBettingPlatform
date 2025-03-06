package database;

import java.io.*;
import java.sql.*;
import java.util.*;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class InsertGames {
    private static final String DB_URL = "jdbc:mysql://db:3306/betting_platform"; // Database connection details
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "rootpassword";
    private static final String CSV_FILE = "/app/march_madness_mens_games_2024.csv"; // Path to CSV file inside Docker
    public static void main(String[] args) {
        // Read CSV file and extract game details
        try (BufferedReader br = new BufferedReader(new FileReader(CSV_FILE))) {
            String line;
            br.readLine(); // Skip header
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (values.length >= 8) {
                    String team1 = values[1].trim();
                    String team2 = values[3].trim();
                    int team1_score = Integer.parseInt(values[2].trim());
                    int team2_score = Integer.parseInt(values[4].trim());
                    String game_date = values[0].trim();
                    
                    // Look up team1_id and team2_id from the teams table
                    // TODO: Implement getTeamId method
                    int team1_id = getTeamId(team1);
                    int team2_id = getTeamId(team2);

                    if (team1_id != -1 && team2_id != -1) {
                        // Insert the game into the games table
                        // TODO: Implement insertGame method
                        insertGame(team1_id, team2_id, team1_score, team2_score, game_date);
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("CSV Read Error: " + e.getMessage());
        }
    }
    

}
