// Import necessary classes for HTTP server functionality
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

// Import IO and networking classes
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

// Import SQL classes for database connection and queries
import java.sql.*;

public class GameDisplay {

    // Entry point of the application
    public static void main(String[] args) throws IOException {
        // Create an HTTP server listening on port 5001 with default backlog
        HttpServer server = HttpServer.create(new InetSocketAddress(5001), 0);

        // Register the /games endpoint and assign a handler for it
        server.createContext("/games", new GameHandler());

        // Use the default executor (creates a thread pool automatically)
        server.setExecutor(null);

        // Start the server
        server.start();

        // Print confirmation to console
        System.out.println("Game Display Server running on port 5001...");
    }

    // Handler class for the /games route
    static class GameHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Check if the request method is GET
            if ("GET".equals(exchange.getRequestMethod())) {
                // Retrieve game data from the database
                String response = getGames();

                // Send HTTP 200 OK with the response length
                exchange.sendResponseHeaders(200, response.length());

                // Write the response to the response body
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                // Reject non-GET requests with 405 Method Not Allowed
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }

    // Retrieves all games from the database and formats them as a JSON-like string
    public static String getGames() {
        // Use a StringBuilder to build the JSON-style response
        StringBuilder result = new StringBuilder("[\n");

        try (
            // Connect to the MySQL database (in Docker container named 'db')
            Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");

            // Create a statement object for executing SQL
            Statement stmt = dbCxn.createStatement();

            // Execute a SELECT query to retrieve all games
            ResultSet rs = stmt.executeQuery("SELECT * FROM games")) {

            // Iterate over each row in the result set
            while (rs.next()) {
                // Append each game's data as a JSON object
                result.append("  {\"game_id\": ").append(rs.getInt("game_id"))
                      .append(", \"team1_id\": ").append(rs.getInt("team1_id"))
                      .append(", \"team2_id\": ").append(rs.getInt("team2_id"))
                      .append(", \"game_time\": \"").append(rs.getTimestamp("game_time"))
                      .append("\", \"team1_odds\": ").append(rs.getBigDecimal("team1_odds"))
                      .append(", \"team2_odds\": ").append(rs.getBigDecimal("team2_odds"))
                      .append("},\n"); // Add comma after each object for formatting
            }
        } catch (SQLException e) {
            // Return a JSON-style error message if SQL fails
            return "{\"error\": \"SQL Error: " + e.getMessage() + "\"}";
        }

        // Remove the trailing comma and newline after the last game, if present
        if (result.length() > 2) {
            result.setLength(result.length() - 2);
        }

        // Close the JSON array
        result.append("\n]");

        // Return the final JSON-like string
        return result.toString();
    }
}
