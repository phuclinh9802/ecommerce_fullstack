const express = require('express'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    User = require('../db/Users')
router = express.Router()

// API 

// register
router.post('/register', (req, res) => {
    var user = new User({
        username: req.body.username, // test on Postman
        password: req.body.password
    })

    user.save().then(() => {
        // generate token
        const token = jwt.sign({ id: user.id }, 'jwt_secret')
        res.json({ token: token })
    }).catch((err) => {
        res.status().json({})
    })
})


// login
router.post('/login', passport.authenticate('local', {
    session: false
}), (req, res) => {

    // generate token
    const token = jwt.sign({ id: req.user.id }, 'jwt_secret')
    res.json({ token: token })

}
)

module.exports = router