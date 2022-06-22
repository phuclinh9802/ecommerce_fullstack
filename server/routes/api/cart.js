const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../../config/keys')

router.get('/cart', (req, res) => {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ message: 'No token provided' });

  jwt.verify(token, keys.secretOrKey, function (err, user) {
    if (err) return res.status(500).send({ message: "Failed to authenticate" });

    Order.findById(decoded.id, function (err, order) {
      if (err) return res.status(500).send("There was a problem finding the item");
      if (!order) return res.status(404).send("No item found.");
      res.status(200).send(order);
    })
  })
})

module.exports = router;
