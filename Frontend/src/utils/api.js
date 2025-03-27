export const queryBackend = async (query) => {
    try {
        const response = await fetch(`http://localhost:5001/query?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error querying backend:", error);
        return "Error: Unable to fetch data";
    }
};