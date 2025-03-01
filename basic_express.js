// Import required modules
const http = require('http');  // Native HTTP module (not needed with Express)
const fs = require('fs');      // File system module (not used in this code)
const url = require('url');    // URL module (not used in this code)
const express = require('express'); // Import Express.js framework

// Initialize Express app
const app = express();

// Define the Home route ("/")
app.get('/', (req, res) => 
    res.send("Hello from Home Page") // Send response for the home page
);

// Define the About route ("/about") with query parameters
app.get('/about', (req, res) => {
    return res.send("Hello from About Page " + req.query.name); // Access query parameter "name"
});

// Start the Express server on port 8000
app.listen(8000, () => 
    console.log('Server started on port 8000') // Log server start message
);
