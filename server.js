const express = require("express");

const app = express();

const PORT = 5000;

// Allows the server to receive JSON data
app.use(express.json());

// ==============================
// TEST API
// ==============================

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working successfully!"
    });
});


// ==============================
// USER REGISTRATION API
// ==============================

app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;

    // Check whether all fields are provided
    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please provide name, email and password"
        });

    }

    // For now, display the received data in terminal
    console.log("New User:");
    console.log("Name:", name);
    console.log("Email:", email);

    res.status(201).json({
        message: "User registered successfully!",
        user: {
            name: name,
            email: email
        }
    });

});


// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
