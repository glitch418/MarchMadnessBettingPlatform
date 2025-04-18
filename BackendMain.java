import java.io.InputStream;
import java.io.InputStreamReader;
import database.InsertBets;

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


import com.google.gson.JsonObject;
import com.google.gson.JsonParser;



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
        server.createContext("/mybets", new BetsHandler());
		server.createContext("/placebet", new PlaceBetHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("HTTP server running on port 5001");
    }
	
	
    static class PlaceBetHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
            exchange.getResponseHeaders().set("Content-Type", "application/json");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            try (InputStream is = exchange.getRequestBody();
                 InputStreamReader isr = new InputStreamReader(is)) {

                JsonObject json = JsonParser.parseReader(isr).getAsJsonObject();
                int userId = json.get("user_id").getAsInt();
                int gameId = json.get("game_id").getAsInt();
                int teamId = json.get("team_id").getAsInt();
                double amount = json.get("amount").getAsDouble();
                String betTypeStr = json.get("bet_type").getAsString();
                int betType = betTypeStr.equalsIgnoreCase("spread") ? 1 : 2;

                double oldBalance = InsertBets.getUserBalance(userId);
                double payout = InsertBets.betHandler(gameId, teamId, userId, oldBalance, amount, betType);
                double newBalance = oldBalance + payout;

                InsertBets.insertBet(userId, gameId, teamId, amount, payout, oldBalance, newBalance);

                String response = "{\"status\":\"Bet placed successfully\"}";
                exchange.sendResponseHeaders(200, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            } catch (Exception e) {
                String err = "{\"error\":\"Failed to place bet: " + e.getMessage() + "\"}";
                exchange.sendResponseHeaders(400, err.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(err.getBytes());
                }
            }
        }
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
                        .append("\"team_name\":\"").append(rs.getString("team_name")).append("\",")
                        .append("\"abbreviation\":\"").append(rs.getString("abbreviation")).append("\",")
                        .append("\"region\":\"").append(rs.getString("region")).append("\",")
                        .append("\"seed\":").append(rs.getInt("seed"))
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
             "SELECT g.game_id, g.team1_id, g.team2_id, " +
             "t1.team_name AS team1_name, t2.team_name AS team2_name, " +
             "g.game_time, g.team1_score, g.team2_score, g.round, " +
             "g.team_favored_id, g.team_dog_id, g.favored_spread, g.dog_spread, " +
             "g.favored_moneyline, g.dog_moneyline " +
             "FROM games g " +
             "JOIN teams t1 ON g.team1_id = t1.team_id " +
             "JOIN teams t2 ON g.team2_id = t2.team_id")) {

        while (rs.next()) {
            result.append("{")
                .append("\"game_id\":").append(rs.getInt("game_id")).append(",")
                .append("\"team1_id\":").append(rs.getInt("team1_id")).append(",")
                .append("\"team2_id\":").append(rs.getInt("team2_id")).append(",")
                .append("\"team1_name\":\"").append(rs.getString("team1_name")).append("\",")
                .append("\"team2_name\":\"").append(rs.getString("team2_name")).append("\",")
                .append("\"game_time\":\"").append(rs.getTimestamp("game_time")).append("\",")
                .append("\"team1_score\":").append(rs.getObject("team1_score") == null ? "null" : rs.getInt("team1_score")).append(",")
                .append("\"team2_score\":").append(rs.getObject("team2_score") == null ? "null" : rs.getInt("team2_score")).append(",")
                .append("\"round\":").append(rs.getObject("round") == null ? "null" : rs.getInt("round")).append(",")
                .append("\"team_favored_id\":").append(rs.getObject("team_favored_id") == null ? "null" : rs.getInt("team_favored_id")).append(",")
                .append("\"team_dog_id\":").append(rs.getObject("team_dog_id") == null ? "null" : rs.getInt("team_dog_id")).append(",")
                .append("\"favored_spread\":").append(rs.getObject("favored_spread") == null ? "null" : rs.getInt("favored_spread")).append(",")
                .append("\"dog_spread\":").append(rs.getObject("dog_spread") == null ? "null" : rs.getInt("dog_spread")).append(",")
                .append("\"favored_moneyline\":").append(rs.getObject("favored_moneyline") == null ? "null" : rs.getInt("favored_moneyline")).append(",")
                .append("\"dog_moneyline\":").append(rs.getObject("dog_moneyline") == null ? "null" : rs.getInt("dog_moneyline"))
                .append("},");
		}

        if (result.length() > 1) {
            result.setLength(result.length() - 1); // remove trailing comma
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

    /**
     * HTTP handler for GET /mybets?email=…  
     * Reads the “email” query param, looks up the user_id,  
     * fetches their bets (with team names and matchup), and returns it as JSON.
     */
    static class BetsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // --- CORS & JSON headers ---
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
            exchange.getResponseHeaders().set("Content-Type", "application/json");

            // preflight check
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            // only allow GET
            if (!"GET".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            // extract email param
            String email = "";
            String rawQuery = exchange.getRequestURI().getQuery();
            if (rawQuery != null) {
                for (String param : rawQuery.split("&")) {
                    String[] kv = param.split("=");
                    if (kv.length == 2 && kv[0].equals("email")) {
                        email = kv[1];
                        break;
                    }
                }
            }
            if (email.isEmpty()) {
                exchange.sendResponseHeaders(400, -1);
                return;
            }

            // look up user_id
            int userId = getUserIdFromEmail(email);
            if (userId == -1) {
                String err = "{\"error\":\"User not found for email " + email + "\"}";
                exchange.sendResponseHeaders(404, err.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(err.getBytes());
                }
                return;
            }

            // build and send JSON 
            String json = getBetsJson(userId);
            byte[] out = json.getBytes();
            exchange.sendResponseHeaders(200, out.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(out);
            }
        }
    }

    /**
     * Retrieve all bets for a given user_id and return as a JSON array.
     * Each object includes:
     *   - bet_id
     *   - team1_name vs team2_name (the matchup)
     *   - team_name (the team the user bet on)
     *   - amount, payout, bet_status
     *
     * @param userId the database ID of the user
     * @return a JSON-formatted String of the user’s bets
     */
    public static String getBetsJson(int userId) {
        StringBuilder result = new StringBuilder("[");
        String query =
            "SELECT b.bet_id, " +
            "       t1.team_name AS team1_name, " +
            "       t2.team_name AS team2_name, " +
            "       t3.team_name AS team_name, " +
            "       b.amount, b.payout, b.bet_status " +
            "  FROM bets b " +
            "  JOIN games g ON b.game_id = g.game_id " +
            "  JOIN teams t1 ON g.team1_id = t1.team_id " +
            "  JOIN teams t2 ON g.team2_id = t2.team_id " +
            "  JOIN teams t3 ON b.team_id   = t3.team_id " +
            " WHERE b.user_id = " + userId;

        try (Connection conn = DriverManager.getConnection(
                 "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                result.append("{")
                      .append("\"bet_id\":").append(rs.getInt("bet_id")).append(",")
                      .append("\"team1_name\":\"").append(rs.getString("team1_name")).append("\",")
                      .append("\"team2_name\":\"").append(rs.getString("team2_name")).append("\",")
                      .append("\"team_name\":\"").append(rs.getString("team_name")).append("\",")
                      .append("\"amount\":").append(rs.getBigDecimal("amount")).append(",")
                      .append("\"payout\":").append(rs.getBigDecimal("payout")).append(",")
                      .append("\"bet_status\":\"").append(rs.getString("bet_status")).append("\"")
                      .append("},");
            }
            if (result.length() > 1) result.setLength(result.length() - 1);
            result.append("]");
        } catch (SQLException e) {
            return "{\"error\": \"Database error: " + e.getMessage() + "\"}";
        }
        return result.toString();
    }

    /** 
     * Look up a user_id given their email address.
     * 
     * @param email the user’s email
     * @return the corresponding user_id, or –1 if none found
     */
    private static int getUserIdFromEmail(String email) {
        String sql = "SELECT user_id FROM users WHERE email = ?";
        try (Connection conn = DriverManager.getConnection(
                 "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt("user_id");
            }
        } catch (SQLException e) {
            System.out.println("Error retrieving user_id for email " + email + ": " + e.getMessage());
        }
        return -1;
    }    
}
