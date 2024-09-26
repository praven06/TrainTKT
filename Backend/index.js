const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const Username = require('./models/username.model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
app.use(express.json());
app.use(cors());
function ConnectToDatabase() {
    
    mongoose.connect(process.env.MONGO_STRING)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.error("Connection failed", error);
    });
}


app.listen(process.env.PORT, () => {
    console.log("Running successfully on port 3001")
    ConnectToDatabase()
    
});
app.post('/signup', async (req, res) => {

    try {

        const { name, username, password } = req.body;
        if (!username || !name || !password) {
            console.log('Error in some input');
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const existingUser = await Username.findOne({ username: username });
        if (existingUser) {
            // console.log('Username already exists');
            return res.status(400).json({ message: "Username already exists" });
        }

  
        const user = await Username.create({ name, username, password: password });
        
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


app.post('/login', async (req, res) => {
    try {
        console.log("okay")
        const user = await Username.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (req.body.password === user.password) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
