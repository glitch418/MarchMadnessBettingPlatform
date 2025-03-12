import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.*;
import java.util.Scanner;

public class BackendMain {
    public static void main(String[] args) throws IOException {
        // Start HTTP server for frontend communication
        startHttpServer();

        // Keep the existing command-line query functionality
        runCommandLineQuery();
    }

    public static void startHttpServer() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(5000), 0);
        server.createContext("/query", new QueryHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("HTTP server running on port 5000");
    }

    static class QueryHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            // Handle preflight requests
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String response = executeQuery(query);
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
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

    //  HTTP API-compatible query execution
    public static String executeQuery(String query) {
        StringBuilder result = new StringBuilder();
        try (Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = dbCxn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            ResultSetMetaData metaData = rs.getMetaData();
            while (rs.next()) {
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                    result.append(rs.getString(i)).append(" ");
                }
                result.append("\n");
            }
        } catch (SQLException e) {
            return "SQL Error: " + e.getMessage();
        }
        return result.toString();
    }
}
