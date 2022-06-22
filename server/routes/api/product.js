const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const data = require('../../data/product')
const Product = require('../../db/Products')

router.get('/', (req, res, next) => {
  return res.json(data);
})

router.post('/', (req, res, next) => {
  token = req.headers['authorization'];

  // remove Bearer
  token = token.replace(/^Bearer\s+/, "")

  if (token) {
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        Product.find().lean().exec((err, products) => {

          const productName = req.body.name;
          const productImage = req.body.image;
          const productDescription = req.body.description;
          const productPrice = req.body.price;
          const productQuantity = req.body.quantity;

          const newProduct = new Product({
            name: productName,
            image: productImage,
            description: productDescription,
            price: productPrice,
            quantity: productQuantity
          })

          newProduct.save();
          return res.status(200).json(products)
        })
      }
    })
  }
})

module.exports = router;