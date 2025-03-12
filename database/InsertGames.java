package database;

import java.io.*;
import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import java.text.ParseException; 
import java.text.SimpleDateFormat;
import java.util.Date;

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

                    // Convert CSV date "M/DD/YYYY" → "YYYY-MM-DD"
                    String mysqlDate = convertDate(game_date);

                    // Failed date conversion if null
                    if (mysqlDate == null) {
                        System.out.println("Skipping row due to date parse error.");
                        continue;
                    }
                    
                    
                    // Look up team1_id and team2_id from the teams table
                    int team1_id = getTeamId(team1);
                    int team2_id = getTeamId(team2);

                    if (team1_id != -1 && team2_id != -1) {
                        // Insert the game into the games table
                        insertGame(team1_id, team2_id, team1_score, team2_score, mysqlDate);                  
                    } else {
                        System.out.println("Skipping game. Could not find IDs for " 
                            + team1 + " or " + team2);
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("CSV Read Error: " + e.getMessage());
        }
    }
   
    // Converts "M/D/YYYY" to "YYYY-MM-DD"
    public static String convertDate(String csvDate) { 
        SimpleDateFormat originalFormat = new SimpleDateFormat("M/d/yyyy"); 
        SimpleDateFormat targetFormat = new SimpleDateFormat("yyyy-MM-dd"); 
        try {
            Date dateObj = originalFormat.parse(csvDate);
            return targetFormat.format(dateObj);
        } catch (ParseException e) {
            System.out.println("Date Parse Error: " + e.getMessage());
            // Skip row
            return null;
        }
    }

    // Retrieves team_id from the teams table
    public static int getTeamId(String abbreviation) {
        // SQL query to select the 'team_id' where the 'abbreviation' matches.
        String query = "SELECT team_id FROM teams WHERE abbreviation = ?";

        // ensure 'conn' and 'pstmt' are automatically closed
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            // Set the '?' parameter in the query to the 'abbreviation' parameter
            pstmt.setString(1, abbreviation);

            // Execute the query
            ResultSet rs = pstmt.executeQuery();

            // If the query returns at least one row
            if (rs.next()) {
                // retrieve the 'team_id' column value
                return rs.getInt("team_id");
            }
        // Handle any SQL exceptions
        } catch (SQLException e) {
            System.out.println("Database Query Error (getTeamId): " + e.getMessage());
        }

        // If no match found or an error occurred, return -1
        return -1;
    }

    /**
     * Inserts a row into the games table
     * 
     * @param team1_id    The unique ID of the first team (foreign key from 'teams' table).
     * @param team2_id    The unique ID of the second team (foreign key from 'teams' table).
     * @param team1_score The final score of the first team.
     * @param team2_score The final score of the second team.
     * @param game_date   The date of the game in 'yyyy-MM-dd' format.
    */ 
    public static void insertGame(int team1_id, int team2_id, int team1_score, int team2_score, String game_date) {

        // SQL query to insert a row into the 'games' table. The columns used must match the DB schema.
        String insertQuery = "INSERT INTO games (team1_id, team2_id, team1_score, team2_score, game_time) "
                           + "VALUES (?, ?, ?, ?, ?)";

        // ensure 'conn' and 'pstmt' are automatically closed
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(insertQuery)) {

            // Set the '?' parameter in the query to the corresponding method argument
            pstmt.setInt(1, team1_id);      // 1st placeholder -> team1_id
            pstmt.setInt(2, team2_id);      // 2nd placeholder -> team2_id
            pstmt.setInt(3, team1_score);   // 3rd placeholder -> team1_score
            pstmt.setInt(4, team2_score);   // 4th placeholder -> team2_score
            pstmt.setString(5, game_date);  // 5th placeholder -> game_date (assumed valid 'yyyy-MM-dd' format)

            // Execute the INSERT statement
            pstmt.executeUpdate();

            // debug message
            System.out.println("Inserted game: " + team1_id + " vs. " + team2_id + " on " + game_date);

        // Handle any SQL exceptions
        } catch (SQLException e) {
            System.out.println("Database Insert Error (insertGame): " + e.getMessage());
        }
    }
}
