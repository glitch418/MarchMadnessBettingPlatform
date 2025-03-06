export const queryBackend = async (sqlQuery) => {
    try {
      const response = await fetch(`http://localhost:5000/query?q=${encodeURIComponent(sqlQuery)}`);
      if (!response.ok) {
        throw new Error("Server returned an error");
      }
      return await response.text();
    } catch (error) {
      console.error("HTTP Error:", error);
      return "Error fetching data from backend.";
    }
  };
  