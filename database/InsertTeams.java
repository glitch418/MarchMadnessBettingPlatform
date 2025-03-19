package database;

import java.io.*;
import java.sql.*;
import java.util.*;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


public class InsertTeams {
    private static final String DB_URL = "jdbc:mysql://db:3306/betting_platform"; // Database connection details
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "rootpassword";
    private static final String CSV_FILE = "/app/march_madness_mens_games_2024.csv"; // Path to CSV file inside Docker

    public static void main(String[] args) {
        Set<String> uniqueTeams = new HashSet<>();

        // Read CSV file and extract unique team abbreviations
        try (BufferedReader br = new BufferedReader(new FileReader(CSV_FILE))) {
            String line;
            br.readLine(); // Skip header
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (values.length >= 5) {
                    uniqueTeams.add(values[1].trim()); // team1 abbreviation
                    uniqueTeams.add(values[3].trim()); // team2 abbreviation
                }
            }
        } catch (IOException e) {
            System.out.println("CSV Read Error: " + e.getMessage());
            return;
        }

        // Insert teams into MySQL
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String insertQuery = "INSERT IGNORE INTO teams (abbreviation) VALUES (?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertQuery)) {
                for (String team : uniqueTeams) {
                    pstmt.setString(1, team);
                    pstmt.executeUpdate();
                }
            }
            System.out.println("Inserted " + uniqueTeams.size() + " teams into the database.");

        } catch (SQLException e) {
            System.out.println("Database Insert Error: " + e.getMessage());
        }
    }
}


