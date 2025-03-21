const express = require('express');
const app = express();
const users = require('./MOCK_DATA.json');
const fs = require('fs');

const PORT = 8111;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

/**
 * 1st Middleware - Logging and Request Modification
 * - Logs a message to the console
 * - Adds a custom property `req.myUserName` to the request object
 * - Logs request details (params, method, path) to a file (`logi.txt`)
 */
app.use((req, res, next) => {
    console.log('Hello from middleware 1');
    req.myUserName = 'aditya';

    fs.appendFile("logi.txt", `\n ${JSON.stringify(req.params)} ${req.method}:${req.path} `, (err, data) => {
        if (err) console.error("Error logging request:", err);
        next(); // Pass control to the next middleware or route handler
    });
});

/**
 * 2nd Middleware - Custom Property Check
 * - Logs a message along with the custom property (`req.myUserName`)
 * - Passes control to the next middleware or route
 */
app.use((req, res, next) => {
    console.log('Hello from middleware 2', req.myUserName);
    next();
});

// Route to display a list of users
app.get('/users', (req, res) => {
    const userList = `<ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    res.send(userList);
});

// API Routes for CRUD operations on users
app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .put((req, res) => {
        // TODO: Implement update logic
    })
    .post((req, res) => {
        const body = req.body;
        console.log(body);
        
        users.push({ ...body, id: users.length + 1 });

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            if (err) throw err;
            console.log("Data has been saved!");
        });

        res.json({ message: "User added successfully!" });
    })
    .delete((req, res) => {
        // TODO: Implement delete logic
    });

// API route to fetch all users
app.get('/api/users', (req, res) => {
    return res.json(users);
});

// Start the server
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
