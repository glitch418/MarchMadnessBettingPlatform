import java.io.*;
import java.net.*;
import java.sql.*;
import java.util.Scanner;

public class BackendMain {

    public static void main(String[] args) {
        // Run both the TCP server and the existing command-line query option
        new Thread(BackendMain::startTCPServer).start();  // Start TCP server in a new thread
        runCommandLineQuery();                            // Keep original functionality
    }

    // Existing method: handles command-line input queries
    public static void runCommandLineQuery() {
        try {
            Connection dbCxn = DriverManager.getConnection(
                "jdbc:mysql://db:3306/betting_platform", "root", "rootpassword");

            String testQuery = receiveQuery();
            System.out.println("Executing query: " + testQuery);

            if(testQuery.toLowerCase().contains("select")) {
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
            }
            else if(testQuery.toLowerCase().contains("insert") || testQuery.toLowerCase().contains("update") || testQuery.toLowerCase().contains("delete")) {
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

    // Existing method: receives query from command line
    public static String receiveQuery() {
        Scanner scan = new Scanner(System.in);
        System.out.println("What would you like to query: ");
        return scan.nextLine();
    }

    // starts a TCP server for frontend communication
    public static void startTCPServer() {
        int port = 5000;

        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("TCP server listening on port " + port);

            while (true) {
                Socket socket = serverSocket.accept(); // Accept incoming frontend connection
                new Thread(() -> handleClient(socket)).start(); // Handle each connection separately
            }

        } catch (IOException e) {
            System.out.println("TCP Server Error: " + e.getMessage());
        }
    }

    public boolean try_login(String email, String password, Connection dbCxn) throws SQLException{
        Statement stmt = dbCxn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'");
        return rs.next();
    }

    public boolean create_user(String username, String email, String password, Connection dbCxn) throws SQLException{
        Statement stmt = dbCxn.createStatement();
        stmt.executeUpdate("INSERT INTO users (username, email, password_hash) VALUES ('" + "'" + username + "'," + email + "', '" + password + "')");
        return true;
    }

    // New method: handles incoming frontend requests
    public static void handleClient(Socket socket) {
        try (
            BufferedReader input = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter output = new PrintWriter(socket.getOutputStream(), true)
        ) {
            String query = input.readLine(); // Receive query from frontend
            System.out.println("Received query from frontend: " + query);

            String result = executeQuery(query); // Execute query
            output.println(result);              // Send result back to frontend

        } catch (IOException e) {
            System.out.println("Client Handling Error: " + e.getMessage());
        }
    }

    // Reusable query execution method for both CLI and TCP
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