// Import the Express framework
const express = require('express');

// Initialize an Express application
const app = express();

// Define the port number on which the server will run
const PORT = 8300;

// Import the built-in File System (fs) module for file operations
const fs = require('fs');

// Load user data from a JSON file
const users = require("./MOCK_DATA.json");

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

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
// Route 3: Handle operations on a specific user by ID
// ============================================
app.route("/api/users/:id")
    // GET: Retrieve a user by ID
    .get((req, res) => {
        const id = Number(req.params.id); // Convert the ID from string to number
        const user = users.find((user) => user.id === id);

        // If user not found, return a 404 error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user); // Send the matched user as JSON
    })

    // POST: Add a new user to the list
    .post((req, res) => {
        const body = req.body; // Get request body
        console.log(body); // Log the request body

        users.push(body); // Add new user to the users array

        // Write the updated data back to MOCK_DATA.json
        fs.writeFileSync('MOCK_DATA.json', JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Failed to write data" });
            }
        });

        return res.json({ status: "success", message: "User added successfully" });
    })

    // PATCH: Update user details (Not implemented yet)
    .patch((req, res) => {
        res.json({ message: "Update user endpoint (PATCH) not implemented yet" });
    })

    // DELETE: Remove a user (Not implemented yet)
    .delete((req, res) => {
        res.json({ message: "Delete user endpoint (DELETE) not implemented yet" });
    });

// ============================================
// Start the server and listen on the specified port
// ============================================
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
