import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class BackendMainTest {

    // Test executeQuery() using an invalid SQL statement.
    @Test
    public void testExecuteQueryInvalid() {
        String invalidQuery = "INVALID QUERY";
        String result = BackendMain.executeQuery(invalidQuery);
        assertNotNull(result, "Result should not be null.");
        assertTrue(result.startsWith("SQL Error:"), "Expected SQL Error when executing an invalid query.");
    }

    // Test exeSelect() with a simulated connection that throws an exception.
    @Test
    public void testExeSelectInvalidQuery() throws SQLException {
        // Create a fake connection and statement using Mockito.
        Connection mockConnection = Mockito.mock(Connection.class);
        Statement mockStatement = Mockito.mock(Statement.class);

        when(mockConnection.createStatement()).thenReturn(mockStatement);
        when(mockStatement.executeQuery(anyString())).thenThrow(new SQLException("Test exception"));

        SQLException exception = assertThrows(SQLException.class, () -> {
            BackendMain.exeSelect("SELECT * FROM invalid_table", mockConnection);
        });
        assertEquals("Test exception", exception.getMessage());
    }

    // Test exeUpdate() with a simulated connection that throws an exception.
    @Test
    public void testExeUpdateInvalidQuery() throws SQLException {
        // Create a fake connection and statement using Mockito.
        Connection mockConnection = Mockito.mock(Connection.class);
        Statement mockStatement = Mockito.mock(Statement.class);

        when(mockConnection.createStatement()).thenReturn(mockStatement);
        doThrow(new SQLException("Test exception")).when(mockStatement).executeUpdate(anyString());

        SQLException exception = assertThrows(SQLException.class, () -> {
            BackendMain.exeUpdate("UPDATE invalid_table SET col = 1", mockConnection);
        });
        assertEquals("Test exception", exception.getMessage());
    }

    // Test receiveQuery() by simulating user input.
    @Test
    public void testReceiveQuery() {
        String simulatedInput = "SELECT * FROM test_table";
        InputStream originalIn = System.in;
        try {
            ByteArrayInputStream in = new ByteArrayInputStream(simulatedInput.getBytes());
            System.setIn(in);
            String query = BackendMain.receiveQuery();
            assertEquals(simulatedInput, query);
        } finally {
            System.setIn(originalIn);
        }
    }

    // Test that startHttpServer() runs without throwing an exception.
    // Note: This will actually start an HTTP server on port 5001.
    @Test
    public void testStartHttpServer() {
        assertDoesNotThrow(() -> {
            BackendMain.startHttpServer();
        });
    }
    
    // Note: runCommandLineQuery() is interactive and is not easily unit tested without refactoring.
}

