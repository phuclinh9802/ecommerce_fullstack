var express = require('express')
require('dotenv').config()
var flash = require('connect-flash') // display notifications for user
var passport = require('passport')
// var request = require('request')
var session = require('express-session')
var bodyParser = require('body-parser')
// var path = require('path')
// var cors = require('cors')
// initialize express
var app = express()
var cors = require('cors')
// initialize PORT 
const PORT = process.env.PORT || 5000

// config app

// cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(cors())
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
const expressSession = require('express-session')
app.use(expressSession({ secret: 'secretKey' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(session({ secret: 'testing auth' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug')
app.set('view options', { layout: false });


require('./auth/routes.js')(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})