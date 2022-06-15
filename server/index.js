// const path = require('path')

// // MongoDB
// const congoose = require('mongoose')
// const { default: mongoose } = require('mongoose')
// mongoose.connect('mongodb://localhost:270d mu17/passport', { userNewUrlParser: true, useCreateIndex: true })

// // init express
// const express = require('express'),
//     app = express(),
//     port = 4000

// // middleware
// const bodyParser = require('body-parser'),
//     flash = require('connect-flash'),
//     passportControl = require('./auth/passport-control')

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.static(path.join(__dirname, 'public')))
// app.use(passportControl.initialize())

// // Routers
// app.use('/api', require('./auth/routes'))


// // Run server
// app.listen(port, () => console.log(`Example app listening on port ${port}`))