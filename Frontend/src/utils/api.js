export const queryBackend = async (query) => {
    try {
        const response = await fetch(`http://localhost:5000/query?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error querying backend:", error);
        return "Error: Unable to fetch data";
    }
};

export const fetchGames = async () => {
    try {
        const response = await fetch("http://localhost:5001/games");
        if (!response.ok) {
            throw new Error(`Failed to fetch games: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching games:", error);
        return [];
    }
};
