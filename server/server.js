const express = require("express");
const session = require('express-session')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport')
const cookieSession = require('cookie-session')
const cors = require('cors')
const users = require('./routes/api/users')
const carts = require('./routes/api/cart')
const product = require('./routes/api/product')
const google = require('./routes/api/google');

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
// app.use(cookieSession({
//     name: 'google-auth-session',
//     keys: ['key1'],
//     maxAge: 24 * 60 * 60 * 1000
// }))


app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: false }
}));

app.use(passport.initialize())

app.use(passport.session())



// passport config
require("./config/passport")(passport)

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))


// app.get('/api/auth/callback',
//     passport.authenticate('google', {
//         successRedirect: '/auth/callback/success',
//         failureRedirect: '/auth/callback/failure'
//     })
// )

// app.get('/auth/callback/success', (req, res) => {
//     res.redirect("")
// })

// Routes
app.use('/api/users', users)
app.use('/api/cart', carts)
app.use('/api/product', product)
app.use("/auth", google)

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
