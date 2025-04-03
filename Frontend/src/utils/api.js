/**
 * 
 * @param {*} query raw sql query to be sent to the backend
 * @returns the result of query in raw form
 */
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

/**
 * 
 * @param {*} email email to login with
 * @param {*} password password to login with
 * @returns the result of the sql query for login in raw form
 */
export const backendLogin = async (email, password) => {
    try {
        const response = await fetch(`http://localhost:5001/login?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error querying backend:", error);
        return "Error: Unable to fetch data";
    }
};

/**
 * 
 * @param {*} email the email to sign up with
 * @param {*} password the password to sign up with
 * @returns empty return for sign up
 */
export const backendSignUp = async (email, password) => {
    try {
        const response = await fetch(`http://localhost:5001/signup?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error querying backend:", error);
        return "Error: Unable to fetch data";
    }
};
