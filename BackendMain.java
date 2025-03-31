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
    }

    public static void startHttpServer() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(5001), 0);
        server.createContext("/query", new QueryHandler());
        server.createContext("/login", new LoginHandler());
        server.createContext("/signup", new SignUpHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("HTTP server running on port 5001");
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
                String query = exchange.getRequestURI().getQuery().substring(2);
                System.out.println(query);
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
    /**
     * LoginHandler class to handle login requests.
     */
    static class LoginHandler extends QueryHandler {
        @Override
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
                // gets url key value pairs and manually parses them for email and password
                String query = exchange.getRequestURI().getQuery();
                int qIndex = query.indexOf("email");
                String email = query.substring(qIndex + 6, query.indexOf("&", qIndex));
                String password = query.substring(query.indexOf("pass") + 5);

                // creates sql query to pass to general query handler
                String fQuery = "SELECT * FROM users WHERE email = '" + email + "' AND password_hash = '" + password + "'";
                System.out.println("email: " + email);
                System.out.println("password: " + password);
                String response = executeQuery(fQuery);
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }
    }

    /**
     * SignUpHandler class to handle signup requests.
     */
    static class SignUpHandler extends QueryHandler {
        @Override
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
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
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

    //  HTTP API-compatible query execution
    public static String executeQuery(String query) {
        StringBuilder result = new StringBuilder();
        String db = "not set";

        // creates connection to database
        try (Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");
             Statement stmt = dbCxn.createStatement();
             
             ) {
                ResultSet rs = null;

                // checks query type
                if (query.toLowerCase().contains("select")) {
                    db = "select";
                    //query = query.substring(2);
                    rs = stmt.executeQuery(query);
                    
                } else if (query.toLowerCase().contains("insert") || query.toLowerCase().contains("update") || query.toLowerCase().contains("delete")) {
                    //query = query.substring(2);
                    rs = null;
                    db = "update " + query;
                    stmt.executeUpdate(query);
                }
                else {
                    rs = null;
                }
            if(rs != null) {
                ResultSetMetaData metaData = rs.getMetaData();
                while (rs.next()) {
                    for (int i = 1; i <= metaData.getColumnCount(); i++) {
                        result.append(rs.getString(i)).append(" ");
                    }
                    result.append("\n");
                }
            }
            return result.toString();
            
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            return "SQL Error: " + query + " " + e.getMessage();
            
        }
        catch (Exception e) {
            return "Other Error: " + db + " " + e.getMessage();
        }
        
    }
}
