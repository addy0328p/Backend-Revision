HTTP status codes are divided into 5 categories, each with a specific range:

Category	Status Code Range	Meaning
1xx Informational	100 - 199	Request received, server processing.
2xx Success	200 - 299	Request successful.
3xx Redirection	300 - 399	Further action required.
4xx Client Errors	400 - 499	Error due to client’s request.
5xx Server Errors	500 - 599	Error on the server side.



const express = require('express');
const app = express();
const PORT = 8300;

// Mock user data
const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" }
];

// ✅ 200 OK - Success
app.get("/api/success", (req, res) => {
    res.status(200).json({ message: "Request was successful!" });
});

// ❌ 400 Bad Request - Invalid request from the client
app.get("/api/bad-request", (req, res) => {
    res.status(400).json({ error: "Bad request! Check your input." });
});

// ❌ 401 Unauthorized - User not authenticated
app.get("/api/unauthorized", (req, res) => {
    res.status(401).json({ error: "Unauthorized access!" });
});

// ❌ 403 Forbidden - User does not have permission
app.get("/api/forbidden", (req, res) => {
    res.status(403).json({ error: "Access forbidden!" });
});

// ❌ 404 Not Found - Resource does not exist
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json(user);
});

// ❌ 500 Internal Server Error - Unexpected server issue
app.get("/api/server-error", (req, res) => {
    res.status(500).json({ error: "Internal Server Error! Please try again later." });
});

// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
