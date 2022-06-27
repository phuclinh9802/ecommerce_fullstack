const router = require("express").Router();
const passport = require("passport");
const Users = require("../../db/Users");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../../middlewares/auth");

router.get("/user", (req, res) => {
  res.send(req.user);
});

router.get("/google/success", (req, res) => {
  // var authorization = req.headers;
  // res.status(200).json({
  //   success: true,
  //   message: "success",
  //   user: req.user,
  //   token: authorization
  // })

  if (typeof req.user == "undefined") {
    return res.status(401).json({ error: "Please sign in again." });
  }
  const googleId = req.user.googleId;
  const password = req.user.password;

  // Find user by email
  Users.findOne({ googleId }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    user.isSocial = true;
    console.log("has user " + user.email);
    console.log("has user " + user.id);
    console.log("has user " + user.firstName);
    console.log("has user: " + user.isSocial)
    // User matched
    // Create JWT Payload
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    // Sign token
    jwt.sign(
      payload,
      keys.secretOrKey,
      {
        expiresIn: 31556926, // 1 year in seconds
      },
      (err, token) => {
        // res.send({ token: "Bearer " + token, redirect_path: "http://locahost:3000/dashboard" })
        res.json({
          success: true,
          token: "Bearer " + token,
        });
      }
    );
  });
});

router.get("/google/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureMessage: "Cannot login, please try again",
    successRedirect: "http://localhost:3000/login/success",
  }),
  (req, res) => {
    res.send("Thank you for signing in.");
  }
);

// router.get('/google/callback', function (req, res, next) {
//   console.log(req.url);
//   passport.authenticate('google', (err, user, info) => {
//     console.log("authenticate -----");
//     console.log(user);
//     console.log(info);
//   })(req, res, next)
// })

module.exports = router;
