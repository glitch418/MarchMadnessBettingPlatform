import java.sql.*;
import java.util.Scanner;
public class BackendMain {

    public static void main(String args[]) {
        try {
            Connection dbCxn=DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/betting_platform","root","rootpassword");
                String testQuery = receiveQuery();
                System.out.println(testQuery);
                Statement selectFromBets=dbCxn.createStatement();
                ResultSet rsBets=selectFromBets.executeQuery(testQuery);
                System.out.println(rsBets.toString());
                
                dbCxn.close();
        }
        catch(Exception e) {System.out.println(e);}
    }

    public static String receiveQuery() {
        String ret = "";
        Scanner scan = new Scanner(System.in);
        System.out.println("What would you like to query: ");
        ret = scan.nextLine();
        return ret;
    }

}