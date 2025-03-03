// Import the Express framework
const express = require('express');

// Initialize an Express application
const app = express();

// Define the port number on which the server will run
const PORT = 8300;

// Import the users' mock data from a JSON file
const users = require("./MOCK_DATA.json");

// ============================================
// Route 1: Serve an HTML list of user names
// ============================================
app.get("/users", (req, res) => {
    // Generate an unordered list of user names dynamically
    const html = `
        <ul>
        ${users.map((user) => {
            return `<li>${user.name}</li>`;
        }).join('')}
        </ul>
    `;

    // Send the generated HTML response
    res.send(html);
});

// ============================================
// Route 2: Return the full users' data as JSON
// ============================================
app.get("/api/users", (req, res) => {
    return res.json(users); // Sends the full users' JSON data
});

// ============================================
// Route 3: Get a specific user by ID
// ============================================
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id); // Convert the ID from string to number

    // Find the user in the array with the matching ID
    const user = users.find((user) => user.id === id);

    // If user is not found, return a 404 error
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.json(user); // Send the matched user as JSON
});

// ============================================
// Start the server and listen on the specified port
// ============================================
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
