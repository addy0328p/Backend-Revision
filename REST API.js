// Importing required modules
const express = require('express');
const fs = require('fs'); // File system module for reading/writing files
const app = express();
const users = require('./MOCK_DATA.json'); // Loading mock user data from a JSON file
const PORT = 8111;

// Middleware to parse URL-encoded data (from form submissions)
app.use(express.urlencoded({ extended: false }));

// Route to display users as an unordered list in HTML
app.get('/users', (req, res) => {
    const a = `<ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    
    res.send(a);
});

// API route to get, update, create, or delete a specific user by ID
app.route("/api/users/:id")
    // GET request: Fetch a user by ID
    .get((req, res) => {
        const id = Number(req.params.id); // Extracting ID from the request parameters
        const user = users.find(user => user.id === id); // Finding the user
        return res.json(user); // Sending the user data as a JSON response
    })
    
    // PUT request: Update a user's data (Not implemented yet)
    .put((req, res) => {

    })
    
    // POST request: Add a new user
    .post((req, res) => {
        const body = req.body;
        console.log(body);

        // Adding a new user with an incremented ID
        users.push({ ...body, id: users.length + 1 });

        // Writing updated user data back to the file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            if (err) throw err;
            console.log("Data has been saved!");
        });
    })
    
    // DELETE request: Remove a user (Not implemented yet)
    .delete((req, res) => {

    });

// API route to get all users as JSON
app.get('/api/users', (req, res) => {
    return res.json(users);
});

// Start the server
app.listen(PORT, () => 
    console.log(`Listening on PORT ${PORT}`)
);
