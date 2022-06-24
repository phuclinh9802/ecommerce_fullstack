const router = require('express').Router();
const passport = require('passport');
const Users = require('../../db/Users');
const jwt = require("jsonwebtoken");
const keys = require('../../config/keys');


router.get("/login/success", (req, res) => {
  res.status(200).json({
    success: true,
    message: "success",
    user: req.user
  })
})

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure"
  })
})

router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    console.log(user.id);
    // console.log(Users.findOne({ id: user.id }));
    Users.findOne({ id: user.id }).then(() => {
      console.log(JSON.stringify(user))
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: 31556926, // 1 year in seconds
        },
        (err, token) => {
          res.redirect('http://localhost:3000/dashboard').json({
            success: true,
            token: "Bearer " + token,
          });
        }
      );
    })
  })(req, res, next);
}
)

// router.get('/google/callback', function (req, res, next) {
//   console.log(req.url);
//   passport.authenticate('google', (err, user, info) => {
//     console.log("authenticate -----");
//     console.log(user);
//     console.log(info);
//   })(req, res, next)
// })

module.exports = router;