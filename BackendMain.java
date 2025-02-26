import java.sql.*;
import java.util.Scanner;
public class BackendMain {

    //runs a single query to the betting_platform database
    public static void main(String args[]) {
        try {
            Connection dbCxn=DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/betting_platform","root","rootpassword");
                String testQuery = receiveQuery();
                System.out.println(testQuery);
                Statement selectFromBets=dbCxn.createStatement();
                ResultSet rsBets=selectFromBets.executeQuery(testQuery);
                ResultSetMetaData rsmet = rsBets.getMetaData();
                while(rsBets.next()) {
                    for(int i = 1; i <= rsmet.getColumnCount(); i++) {
                        if (i > 1) System.out.print(",  ");
                        String columnValue = rsBets.getString(i);
                        System.out.print(columnValue + " " + rsmet.getColumnName(i));
                    }
                }
                
                dbCxn.close();
        }
        catch(Exception e) {System.out.println(e);}
    }

    //gets the query from the command line input
    public static String receiveQuery() {
        String ret = "";
        Scanner scan = new Scanner(System.in);
        System.out.println("What would you like to query: ");
        ret = scan.nextLine();
        return ret;
    }

}