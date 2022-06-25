require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const uuid = require("uuid").v4;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const jwt = require("jsonwebtoken");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
        scope: ["profile", "email"],
        state: true,
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile.id);

        if (!profile.id) {
          return done(null, null);
        }

        var usr = {
          id: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password: uuid(),
          googleId: profile.id,
        };
        User.findOne({ googleId: profile.id }).then((user) => {
          if (!user) {
            console.log("no user");
            newUser = new User(usr);
            newUser.save();
            console.log(JSON.stringify(user));
            const payload = {
              id: user.googleId,
              firstName: user.firstName,
              lastName: user.lastName,
              googleId: user.googleId,
            };
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 31556926, // 1 year in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          }
          return;
        });

        if (usr) return done(null, usr);
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.googleId);
    done(null, user.googleId);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ googleId: id }).catch((err) => {
      console.log("Error deserializing", err);
      done(err, null);
    });

    console.log("DeSerialized user", user);

    if (user) done(null, user);
  });
};
