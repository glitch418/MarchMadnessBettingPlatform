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

    public static void main(String[] args) throws IOException {
        startHttpServer();
    }

    public static void startHttpServer() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(5001), 0);
        server.createContext("/query", new QueryHandler());
        server.createContext("/login", new LoginHandler());
        server.createContext("/signup", new SignUpHandler());
        server.createContext("/games", new GameHandler());
        server.createContext("/teams", new TeamHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("HTTP server running on port 5001");
    }

    static class QueryHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String response = executeQuery(query.substring(2));
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }

    static class LoginHandler extends QueryHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                int qIndex = query.indexOf("email");
                String email = query.substring(qIndex + 6, query.indexOf("&", qIndex));
                String password = query.substring(query.indexOf("pass") + 5);

                String fQuery = "SELECT * FROM users WHERE email = '" + email + "' AND password_hash = '" + password + "'";
                System.out.println("email: " + email);
                System.out.println("password: " + password);
                String response = executeQuery(fQuery);

                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }

    static class SignUpHandler extends QueryHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                int qIndex = query.indexOf("email");
                String email = query.substring(qIndex + 6, query.indexOf("&", qIndex));
                String password = query.substring(query.indexOf("pass") + 5);
                String fQuery = "INSERT INTO users (username, email, password_hash) VALUES ('" + email + "', '" + email + "', '" + password + "')";
                System.out.println("email: " + email);
                System.out.println("password: " + password);
                String response = executeQuery(fQuery);
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }

    static class TeamHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Content-Type", "application/json");

            if (!"GET".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            String json = getTeamsJson();
            byte[] responseBytes = json.getBytes();

            exchange.sendResponseHeaders(200, responseBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(responseBytes);
            os.close();
        }
    }

    public static String getTeamsJson() {
        StringBuilder result = new StringBuilder("[");
        try (Connection conn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM teams")) {

            while (rs.next()) {
                result.append("{")
                        .append("\"team_id\":").append(rs.getInt("team_id")).append(",")
                        .append("\"team_name\":\"").append(rs.getString("team_name")).append("\"")  // updated column name
                        .append("},");
            }

            if (result.length() > 1) {
                result.setLength(result.length() - 1); // Remove trailing comma
            }

            result.append("]");
        } catch (SQLException e) {
            return "{\"error\":\"Database error: " + e.getMessage() + "\"}";
        }
        return result.toString();
    }

    static class GameHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Content-Type", "application/json");

            if (!"GET".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            String json = getGamesJson();
            byte[] responseBytes = json.getBytes();

            exchange.sendResponseHeaders(200, responseBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(responseBytes);
            os.close();
        }
    }

    public static String getGamesJson() {
        StringBuilder result = new StringBuilder("[");
        try (Connection conn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(
                "SELECT g.game_id, t1.team_name AS team1_name, t2.team_name AS team2_name " +  // updated column name
                "FROM games g " +
                "JOIN teams t1 ON g.team1_id = t1.team_id " +
                "JOIN teams t2 ON g.team2_id = t2.team_id")) {

            while (rs.next()) {
                result.append("{")
                        .append("\"game_id\":").append(rs.getInt("game_id")).append(",")
                        .append("\"team1_name\":\"").append(rs.getString("team1_name")).append("\",")
                        .append("\"team2_name\":\"").append(rs.getString("team2_name")).append("\"")
                        .append("},");
            }

            if (result.length() > 1) {
                result.setLength(result.length() - 1); // Remove trailing comma
            }

            result.append("]");
        } catch (SQLException e) {
            return "{\"error\":\"Database error: " + e.getMessage() + "\"}";
        }
        return result.toString();
    }

    public static String executeQuery(String query) {
        StringBuilder result = new StringBuilder();
        try (Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = dbCxn.createStatement()) {

            ResultSet rs = null;
            if (query.toLowerCase().contains("select")) {
                rs = stmt.executeQuery(query);
            } else if (query.toLowerCase().contains("insert") || query.toLowerCase().contains("update") || query.toLowerCase().contains("delete")) {
                stmt.executeUpdate(query);
                return "Update successful";
            }

            if (rs != null) {
                ResultSetMetaData metaData = rs.getMetaData();
                while (rs.next()) {
                    for (int i = 1; i <= metaData.getColumnCount(); i++) {
                        result.append(rs.getString(i)).append(" ");
                    }
                    result.append("\n");
                }
            }

        } catch (SQLException e) {
            return "SQL Error: " + query + " " + e.getMessage();
        } catch (Exception e) {
            return "Other Error: " + e.getMessage();
        }
        return result.toString();
    }
}
