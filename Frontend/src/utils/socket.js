import net from 'net';

/**
 * Sends a query to the backend via TCP.
 * @param {string} sqlQuery - SQL query to execute.
 * @returns {Promise<string>} - Query results from backend.
 */
export const queryBackend = (sqlQuery) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.connect(5000, 'backend', () => {
      console.log('Connected to backend');
      client.write(sqlQuery); // Send SQL query
    });

    client.on('data', (data) => {
      resolve(data.toString()); // Return backend response
      client.destroy();         // Close connection after receiving data
    });

    client.on('error', (err) => {
      console.error('TCP Error:', err);
      reject(err); // Handle errors
    });

    client.on('close', () => {
      console.log('Connection closed');
    });
  });
};
