const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport')
const users = require('./routes/api/users')
const carts = require('./routes/api/cart')
const product = require('./routes/api/product')

const app = express();
// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize())

// passport config
require("./config/passport")(passport)

// Routes
app.use('/api/users', users)
app.use('/api/cart', carts)
app.use('/api/product', product)

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));