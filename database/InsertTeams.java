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

    // CSV with game data
    private static final String CSV_FILE = "/app/march_madness_mens_games_2024.csv"; // Path to CSV file inside Docker
    // CSV pairing abbreviation to full team name
    private static final String MAPPING_CSV = "/app/teams_mapping.csv";

    public static void main(String[] args) {
        // Extract abbreviations from the games CSV
        Set<String> uniqueTeams = extractAbbreviationsFromGames(CSV_FILE);

        // Load mapping from abbreviations to full names
        Map<String, String> teamNameMap = loadTeamMapping(MAPPING_CSV);

        // Insert or update each team (abbr + team_name) into the DB
        insertOrUpdateTeams(uniqueTeams, teamNameMap);
    }

    /**
     * Reads main March Madness CSV (games) to collect all unique abbreviations.
     */
    private static Set<String> extractAbbreviationsFromGames(String csvFile) {
        Set<String> uniqueTeams = new HashSet<>();
        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            br.readLine(); // Skip header
            String line;
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (values.length >= 5) {
                    String team1 = values[1].trim(); // team1 abbreviation
                    String team2 = values[3].trim(); // team2 abbreviation
                    uniqueTeams.add(team1);
                    uniqueTeams.add(team2);
                }
            }
            System.out.println("Found " + uniqueTeams.size() + " unique abbreviations from games CSV.");
        } catch (IOException e) {
            System.out.println("CSV Read Error (Games CSV): " + e.getMessage());
        }
        return uniqueTeams;
    }

    /**
     * Loads teams_mapping.csv file, building a map of abbreviation to full team name.
     */
    private static Map<String, String> loadTeamMapping(String mappingFile) {
        Map<String, String> teamMap = new HashMap<>();
        try (BufferedReader br = new BufferedReader(new FileReader(mappingFile))) {
            br.readLine(); // Skip header
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 2) {
                    String abbr = parts[0].trim();
                    String fullName = parts[1].trim();
                    teamMap.put(abbr, fullName);
                }
            }
            System.out.println("Loaded " + teamMap.size() + " mappings from " + mappingFile);
        } catch (IOException e) {
            System.out.println("CSV Read Error (Mapping CSV): " + e.getMessage());
        }
        return teamMap;
    }

    /**
     * Inserts or updates each team in 'teams' table with abbreviation + full team name.
     */
    private static void insertOrUpdateTeams(Set<String> uniqueTeams, Map<String, String> teamNameMap) {
        String upsertQuery = "INSERT INTO teams (abbreviation, team_name) "
                           + "VALUES (?, ?) "
                           + "ON DUPLICATE KEY UPDATE team_name = VALUES(team_name)";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(upsertQuery)) {

            int count = 0;
            for (String abbr : uniqueTeams) {
                // Use mapping if present, otherwise fallback to "TBD"
                String fullName = teamNameMap.getOrDefault(abbr, abbr + " - TBD");
                pstmt.setString(1, abbr);
                pstmt.setString(2, fullName);
                pstmt.executeUpdate();
                count++;
            }
            System.out.println("Inserted or updated " + count + " teams into the database.");

        } catch (SQLException e) {
            System.out.println("Database Insert/Update Error: " + e.getMessage());
        }
    }
}


