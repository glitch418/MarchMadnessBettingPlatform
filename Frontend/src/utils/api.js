// Function to send a SQL query to the backend server (port 5000) and get the result as text
export const queryBackend = async (query) => {
    try {
        // Send a GET request to the backend with the query encoded in the URL
        const response = await fetch(`http://localhost:5000/query?q=${encodeURIComponent(query)}`);

        // Check if the response status is not OK (200–299 range)
        if (!response.ok) {
            // If not OK, throw an error with the response status
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // If successful, return the response as plain text (not JSON)
        return await response.text();
    } catch (error) {
        // Log any error that occurred during the fetch
        console.error("Error querying backend:", error);

        // Return a fallback message for the UI or caller
        return "Error: Unable to fetch data";
    }
};

// Function to fetch game data from another backend endpoint (port 5001) as JSON
export const fetchGames = async () => {
    try {
        // Send a GET request to the /games endpoint
        const response = await fetch("http://localhost:5001/games");

        // Check if the response was successful
        if (!response.ok) {
            // If not, throw an error with the HTTP status
            throw new Error(`Failed to fetch games: ${response.status}`);
        }

        // Return the parsed JSON data from the response
        return await response.json();
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching games:", error);

        // Return an empty array as a fallback (to avoid breaking the UI)
        return [];
    }
};
