const express = require('express');
const app = express();
const PORT = 8300;
const fs = require('fs');
const users = require("./MOCK_DATA.json");

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Middleware to log request headers
app.use((req, res, next) => {
    console.log("Request Headers:", req.headers);
    next();
});

// API Route to get all users
app.get("/api/users", (req, res) => {
    res.setHeader("Content-Type", "application/json"); // Specify response format
    res.setHeader("Cache-Control", "no-cache"); // Prevent caching
    res.json(users);
});

// API Route to handle user operations by ID
app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        res.setHeader("Custom-Header", "User-Data"); // Custom header example
        res.json(user);
    })
    .post((req, res) => {
        const body = req.body;
        users.push(body);
        fs.writeFileSync('MOCK_DATA.json', JSON.stringify(users));
        res.setHeader("Operation", "User-Added"); // Custom operation header
        res.send("User added successfully");
    });

// Starting the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
1️⃣ Request Headers
Sent by the client (browser/API consumer).
Example: req.headers logs all headers.
Example: req.get('User-Agent') gets the browser details.
2️⃣ Response Headers
Sent by the server to the client.
Example:
js
Copy
Edit
res.setHeader("Content-Type", "application/json"); // Defines response format
res.setHeader("Cache-Control", "no-cache"); // Prevents browser caching
res.setHeader("Custom-Header", "User-Data"); // Custom metadata
res.setHeader("Operation", "User-Added"); // Custom response header
