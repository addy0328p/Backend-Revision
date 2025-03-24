MongoDB is a NoSQL database that stores data in JSON-like documents (BSON format), making it flexible and scalable.

Mongoose is an ODM (Object Data Modeling) library for MongoDB that provides schema-based structure, validation, and query-building for Node.js applications.

Connecting Mongoose to MongoDB involves calling mongoose.connect("mongodb://127.0.0.1:27017/dbName").

db.users.find({}) in MongoDB Shell retrieves all documents from the users collection.

Common MongoDB Commands:

show dbs → List all databases.

use <databaseName> → Switch to a database.

show collections → Show all collections in the current database.

db.users.insertOne({...}) → Insert one document.

db.users.find({}) → Fetch all documents from the users collection.

db.users.updateOne({criteria}, {$set: {fields}}) → Update a document.

db.users.deleteOne({criteria}) → Delete a document.







  const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const PORT = 8111;

// ✅ Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ MongoDB Connection using Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/adityaP") // Connecting to local MongoDB
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

// ✅ User Schema & Model
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true }, // First name is required
    lastName: { type: String }, // Last name is optional
    gender: { type: String }, // Gender field
    email: { type: String, required: true, unique: true }, // Email is required and must be unique
  },
  { timestamps: true } // Adds createdAt & updatedAt fields automatically
);

// ✅ Creating a Mongoose Model
const User = mongoose.model("User", userSchema);

// ✅ Logging Middleware (Records API requests)
app.use((req, res, next) => {
  console.log("Middleware 1 executed");
  req.myUserName = "aditya"; // Adding a custom property to the request

  // Logging request method and path to a file
  fs.appendFile("logi.txt", `\n ${req.method}:${req.path}`, (err) => {
    if (err) console.error("Logging error:", err);
    next();
  });
});

app.use((req, res, next) => {
  console.log("Middleware 2 executed:", req.myUserName);
  next();
});

// ✅ Route to Fetch All Users (GET /users)
app.get("/users", async (req, res) => {
  try {
    const allDbUsers = await User.find({}); // Fetch all users from the database
    const userList = `<ul>${allDbUsers
      .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
      .join("")}</ul>`;
    res.send(userList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ✅ Create a New User (POST /api/users)
app.post("/api/users", async (req, res) => {
  try {
    const { firstName, lastName, gender, email } = req.body;

    // Validate required fields
    if (!firstName || !email) {
      return res.status(400).json({ error: "firstName and email are required" });
    }

    const newUser = await User.create({ firstName, lastName, gender, email });
    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ✅ API Routes for Users (GET, PUT, DELETE)
app.route("/api/users/:id")
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id); // Find user by ID
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) return res.status(404).json({ error: "User not found" });
      return res.json({ message: "User updated", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ error: "User not found" });
      return res.json({ message: "User deleted", user: deletedUser });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  });

// ✅ Get All Users from Database
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await User.find({}); // Fetch all users
    return res.json(allUsers);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ✅ Start Express Server
app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
