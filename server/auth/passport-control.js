const { Strategy } = require('passport-local')

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../db/Users'),
    passportJWT = require('passport-jwt'),
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt


// Local Strategy
passport.use(new Strategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        // check for error
        if (err) return done(err)

        // check if user does not exist
        if (!user) {
            return done(null, false, {
                message: "No user found"
            })
        }
        user.login(password).then(() => {
            return done(null, user)
        }).catch((err) => {
            return done(err, false, {
                message: 'Password not matched'
            })
        })
    })
}


))

// JWT
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'jwt_secret'
}, (jwt_payload, done) => {
    User.findById(jwt_payload.id).then(user => {
        return done(null, user)
    }).catch(err => {
        return done(err, false, {
            message: 'Token not matched'
        })
    })
}))

module.exports = passport