// Import necessary classes for HTTP server functionality
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

// Import IO and networking classes
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

// Import SQL classes for database operations
import java.sql.*;

// Import Scanner for reading user input from the command line
import java.util.Scanner;

public class BackendMain {

    // Entry point of the program
    public static void main(String[] args) throws IOException {
        // Start the HTTP server to handle requests from the frontend
        startHttpServer();

        // Keep command-line query functionality for manual testing/debugging
        runCommandLineQuery();
    }

    // Method to start a simple HTTP server on port 5000
    public static void startHttpServer() throws IOException {
        // Bind the server to port 5000 with a backlog of 0 (default)
        HttpServer server = HttpServer.create(new InetSocketAddress(5000), 0);

        // Register a context (route) for "/query" and assign a handler
        server.createContext("/query", new QueryHandler());

        // Use default executor (null means a default thread pool will be used)
        server.setExecutor(null);

        // Start the server
        server.start();

        // Log that the server has started
        System.out.println("HTTP server running on port 5000");
    }

    // Inner class that handles HTTP requests to "/query"
    static class QueryHandler implements HttpHandler {
        // Method that handles incoming HTTP requests
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers to allow requests from any origin (frontend-friendly)
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            // Handle preflight OPTIONS requests used by browsers before sending real requests
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); // 204 No Content, no response body
                return;
            }

            // Only allow GET requests to perform queries
            if ("GET".equals(exchange.getRequestMethod())) {
                // Extract the query string from the URL (e.g., ?SELECT * FROM users)
                String query = exchange.getRequestURI().getQuery();

                // Execute the SQL query and get the result as a string
                String response = executeQuery(query);

                // Send response headers with status 200 and response length
                exchange.sendResponseHeaders(200, response.length());

                // Send the actual response body
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                // Reject any non-GET/OPTIONS request with 405 Method Not Allowed
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }


    // Philip's Database Connection
    public static void runCommandLineQuery() {
        try {
            Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");

            String testQuery = receiveQuery();
            System.out.println("Executing query: " + testQuery);

            if (testQuery.toLowerCase().contains("select")) {
                ResultSet rs = exeSelect(testQuery, dbCxn);
                while (rs.next()) {
                    ResultSetMetaData rsMeta = rs.getMetaData();
                    for (int i = 1; i <= rsMeta.getColumnCount(); i++) {
                        if (i > 1) System.out.print(",  ");
                        String columnValue = rs.getString(i);
                        System.out.print(columnValue + " " + rsMeta.getColumnName(i));
                    }
                    System.out.println();
                }
            } else if (testQuery.toLowerCase().contains("insert") || testQuery.toLowerCase().contains("update") || testQuery.toLowerCase().contains("delete")) {
                exeUpdate(testQuery, dbCxn);
            }

            dbCxn.close();

        } catch (Exception e) {
            System.out.println("Command-line Query Error: " + e.getMessage());
        }
    }

    public static ResultSet exeSelect(String query, Connection dbCxn) throws SQLException {
        Statement stmt = dbCxn.createStatement();
        return stmt.executeQuery(query);
    }

    public static void exeUpdate(String query, Connection dbCxn) throws SQLException {
        Statement stmt = dbCxn.createStatement();
        stmt.executeUpdate(query);
    }

    public static String receiveQuery() {
        Scanner scan = new Scanner(System.in);
        System.out.println("What would you like to query: ");
        return scan.nextLine();
    }

  // Execute SQL query and return the result as a formatted string (used by HTTP server)
    public static String executeQuery(String query) {
        StringBuilder result = new StringBuilder();
        try (
            // Establish connection to database
            Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");

            // Create a statement object to run the query
            Statement stmt = dbCxn.createStatement();

            // Execute the query and get the results
            ResultSet rs = stmt.executeQuery(query)) {

            // Get metadata to determine column count and names
            ResultSetMetaData metaData = rs.getMetaData();

            // Process each row of the result set
            while (rs.next()) {
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                    // Append each column value followed by a space
                    result.append(rs.getString(i)).append(" ");
                }
                result.append("\n"); // Newline after each row
            }
        } catch (SQLException e) {
            // Return error message if SQL fails
            return "SQL Error: " + e.getMessage();
        }
        return result.toString(); // Return formatted result
    }
}
