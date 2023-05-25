const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Connect Mongoose Database
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  console.log("Connected to database");
});

//Get all users
app.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// Add a new user
app.post("/users", (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });
  user
    .save()
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

// Update a user by ID
app.put("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;

      return user.save();
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return user.remove();
    })
    .then(() => {
      res.json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

//launch Server
app.listen(process.env.PORT, () => {
  console.log(`Server islistening on port ${process.env.PORT}`);
});
