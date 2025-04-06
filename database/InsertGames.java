package database;

import java.io.*;
import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;  // This imports java.util.Date, which conflicts with java.sql.Date

public class InsertGames {
    private static final String DB_URL = "jdbc:mysql://db:3306/betting_platform"; // Database connection details
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "rootpassword";
    private static final String CSV_FILE = "/app/march_madness_mens_games_2024.csv"; // Path to CSV file inside Docker

    public static void main(String[] args) {
        // DEBUG: Startup message for debugging
        // System.out.println("Starting InsertGames prefill...");
        try (BufferedReader br = new BufferedReader(new FileReader(CSV_FILE))) {
            String line;
            // DEBUG: Read and print CSV header
            String header = br.readLine();
            System.out.println("CSV Header: " + header);
            int rowCount = 0; // DEBUG: Row counter

            while ((line = br.readLine()) != null) {
                rowCount++; // DEBUG: Increment row count
                // DEBUG: Print the raw row content
                // System.out.println("Processing row " + rowCount + ": " + line);

                String[] values = line.split(",");
                // DEBUG: Print column count and values array
                // System.out.println("Row " + rowCount + " has " + values.length + " columns: " + Arrays.toString(values));
                
                if (values.length >= 8) {
                    String team1 = values[1].trim();
                    String team2 = values[3].trim();
                    int team1_score = Integer.parseInt(values[2].trim());
                    int team2_score = Integer.parseInt(values[4].trim());
                    String game_date = values[0].trim();

                    // DEBUG: Print extracted values
                    // System.out.println("Row " + rowCount + ": team1 = " + team1 + ", team2 = " + team2 +
                    //                    ", team1_score = " + team1_score + ", team2_score = " + team2_score +
                    //                    ", game_date = " + game_date);
                    
                    // Convert CSV date "M/D/YYYY" → "YYYY-MM-DD"
                    String mysqlDate = convertDate(game_date);
                    if (mysqlDate == null) {
                        System.out.println("Row " + rowCount + ": Skipping row due to date parse error.");
                        continue;
                    }
                    // DEBUG: Print converted date
                    // System.out.println("Row " + rowCount + ": Converted date = " + mysqlDate);
                    
                    // Look up team IDs from the teams table
                    int team1_id = getTeamId(team1);
                    int team2_id = getTeamId(team2);
                    // DEBUG: Print team lookup results
                    // System.out.println("Row " + rowCount + ": Team lookup: " + team1 + " -> " + team1_id +
                    //                    ", " + team2 + " -> " + team2_id);
                    
                    if (team1_id != -1 && team2_id != -1) {
                        insertGame(team1_id, team2_id, team1_score, team2_score, mysqlDate);
                    } else {
                        System.out.println("Row " + rowCount + ": Skipping game. Could not find IDs for " 
                            + team1 + " or " + team2);
                    }
                } else {
                    System.out.println("Row " + rowCount + ": Skipping due to insufficient columns.");
                }
            }
            // DEBUG: Summary after processing all rows
            // System.out.println("Finished processing " + rowCount + " rows.");
        } catch (IOException e) {
            System.out.println("CSV Read Error: " + e.getMessage());
        }
    }
   
    // Converts "M/D/YYYY" to "YYYY-MM-DD"
    public static String convertDate(String csvDate) { 
        SimpleDateFormat originalFormat = new SimpleDateFormat("M/d/yyyy"); 
        SimpleDateFormat targetFormat = new SimpleDateFormat("yyyy-MM-dd"); 
        try {
            java.util.Date dateObj = originalFormat.parse(csvDate);
            return targetFormat.format(dateObj);
        } catch (ParseException e) {
            System.out.println("Date Parse Error: " + e.getMessage());
            return null;
        }
    }

    // Retrieves team_id from the teams table
    public static int getTeamId(String abbreviation) {
        String query = "SELECT team_id FROM teams WHERE abbreviation = ?";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, abbreviation);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("team_id");
            }
        } catch (SQLException e) {
            System.out.println("Database Query Error (getTeamId) for " + abbreviation + ": " + e.getMessage());
        }
        return -1;
    }

    /**
     * Inserts a row into the games table.
     */
    public static void insertGame(int team1_id, int team2_id, int team1_score, int team2_score, String game_date) {
        String insertQuery = "INSERT INTO games (team1_id, team2_id, team1_score, team2_score, game_time) " +
                             "VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(insertQuery)) {
            pstmt.setInt(1, team1_id);
            pstmt.setInt(2, team2_id);
            pstmt.setInt(3, team1_score);
            pstmt.setInt(4, team2_score);
            pstmt.setString(5, game_date);
            pstmt.executeUpdate();
            // DEBUG: Print confirmation of insertion
            // System.out.println("Inserted game: " + team1_id + " vs. " + team2_id + " on " + game_date);
        } catch (SQLException e) {
            System.out.println("Database Insert Error (insertGame): " + e.getMessage());
        }
    }
}
