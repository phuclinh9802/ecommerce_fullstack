const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../db/Users");
const Users = require("../../db/Users");
const mongoose = require('mongoose');
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email, isSocial: false }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch((err) => console.log(err));
                });
            });
        }
    });
});

const isUserAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send("You must login first!");
    }
};

router.get("/me", (req, res) => {
    if (req.headers && req.headers.authorization) {
        // get token from that user
        var authorization = req.headers.authorization.split(" ")[1];
        try {
            decoded = jwt.verify(authorization, keys.secretOrKey);
        } catch (e) {
            return res.status(401).send("Unauthorized");
        }
        var userId = decoded.id;
        Users.findOne({ _id: userId }).then((user) => {
            return res.json(decoded);
        });
    }
});
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    console.log("find by id: " + JSON.stringify(req.body));
    // Find user by email
    User.findOne({ email }).then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
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
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

router.put('/shipping-billing', (req, res) => {
    var shipAddress = req.body.shipAddress;
    var shipCity = req.body.shipCity;
    var shipState = req.body.shipState;
    var shipCode = req.body.shipCode;
    var shipCountry = req.body.shipCountry;
    var billAddress = req.body.billAddress;
    var billCity = req.body.billCity;
    var billState = req.body.billState;
    var billCode = req.body.billCode;
    var billCountry = req.body.billCountry;

    const body = {
        shipAddress,
        shipCity,
        shipState,
        shipCode,
        shipCountry,
        billAddress,
        billCity,
        billState,
        billCode,
        billCountry
    }

    console.log(JSON.stringify(req.body))

    if (req.headers && req.headers.authorization) {
        // get token from that user
        var authorization = req.headers.authorization.split(" ")[1];
        try {
            decoded = jwt.verify(authorization, keys.secretOrKey);
        } catch (e) {
            return res.status(401).send("Unauthorized");
        }
        var userId = decoded.id;
        console.log("userId " + userId);
        var convertedId = mongoose.Types.ObjectId(userId);
        console.log("convertedId " + convertedId);

        User.findOneAndUpdate({ _id: userId }, body).then((user) => {
            console.log(JSON.stringify("user: " + user))
            res.send(user);
        })
    }
})


module.exports = router;

//   address: {
//     type: String,
//   },
//   city: {
//     type: String,
//   },
//   state: {
//     type: String,
//   },
//   postalCode: {
//     type: Number,
//   },
//   country: {
//     type: String,
//   },
//   billAddress: {
//     type: String,
//   },
//   billCity: {
//     type: String,
//   },
//   billCode: {
//     type: Number,
//   },
//   billCountry: {
//     type: String,
//   },
//   shipAddress: {
//     type: String,
//   },
//   shipCity: {
//     type: String,
//   },
//   shipCode: {
//     type: Number,
//   },
//   shipCountry: {
//     type: String,
//   },
// });
