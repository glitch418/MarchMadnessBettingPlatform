import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.*;

public class GameDisplay {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(5001), 0);
        server.createContext("/games", new GameHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Game Display Server running on port 5001...");
    }

    static class GameHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String response = getGames();
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }
    }

    public static String getGames() {
        StringBuilder result = new StringBuilder("[\n");
        try (Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = dbCxn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM games")) {

            while (rs.next()) {
                result.append("  {\"game_id\": ").append(rs.getInt("game_id"))
                      .append(", \"team1_id\": ").append(rs.getInt("team1_id"))
                      .append(", \"team2_id\": ").append(rs.getInt("team2_id"))
                      .append(", \"game_time\": \"").append(rs.getTimestamp("game_time"))
                      .append("\", \"team1_odds\": ").append(rs.getBigDecimal("team1_odds"))
                      .append(", \"team2_odds\": ").append(rs.getBigDecimal("team2_odds"))
                      .append("},\n");
            }
        } catch (SQLException e) {
            return "{\"error\": \"SQL Error: " + e.getMessage() + "\"}";
        }

        if (result.length() > 2) {
            result.setLength(result.length() - 2); // Remove last comma
        }
        result.append("\n]");
        return result.toString();
    }
}
