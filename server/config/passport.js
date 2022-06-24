require('dotenv').config()
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const uuid = require('uuid').v4
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {

    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );


    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/auth/google/callback',
            scope: ['profile'],
            state: true
        },
            function (accessToken, refreshToken, profile, done) {
                console.log(profile.emails[0].value);
                User.findOne({ id: profile.id }).then((user) => {
                    if (!user) {
                        var usr = new User({
                            id: profile.id, firstName: profile.given_name, lastName: profile.family_name, email: profile.emails[0].value, password: uuid()
                        })
                        usr.save();
                        return;
                    }
                    return;
                })

                return done(null, profile);
                // User.create({ id: profile.id, firstName: profile.given_name, lastName: profile.family_name, email: profile.emails[0].value, password: uuid() }, (err, user) => {
                //     return done(null, user);
                // })
            }

        )
    )

    passport.serializeUser((user, done) => {
        done(null, user);
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    });
};