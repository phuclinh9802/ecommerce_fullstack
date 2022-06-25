require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const uuid = require("uuid").v4;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(JSON.stringify(profile));

        if (!profile.id) {
          return done(null, null);
        }

        let nameLength = profile.displayName.split(" ").length;
        let firstName = String(
          profile.displayName.split(" ").slice(0, -1 * (nameLength - 1))
        );
        let lastName = String(profile.displayName.split(" ").slice(-1));

        var usr = {
          id: profile.id,
          firstName: firstName,
          lastName: lastName,
          email: profile.profileUrl,
          password: uuid(),
          githubId: profile.id,
        };
        User.findOne({ githubId: profile.id }).then((user) => {
          if (!user) {
            console.log("no user");
            let newUser = new User(usr);
            newUser.save();
            console.log(JSON.stringify(user));
            // const payload = {
            //   id: user.githubId,
            //   firstName: user.firstName,
            //   lastName: user.lastName,
            //   githubId: user.githubId,
            // };
            // jwt.sign(
            //   payload,
            //   keys.secretOrKey,
            //   {
            //     expiresIn: 31556926, // 1 year in seconds
            //   },
            //   (err, token) => {
            //     res.json({
            //       success: true,
            //       token: "Bearer " + token,
            //     });
            //   }
            // );
          }
          return;
        });

        if (usr) return done(null, usr);
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.githubId);
    done(null, user.id);
  });
};
