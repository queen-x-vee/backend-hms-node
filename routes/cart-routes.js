//each buyer should have a profile

//there should be a list of buyers which only admin should have access to

const express = require('express')

const cartRouter = express.Router()

const { protect} = require('../middleware/auth.middleware')
const { addToCart} = require('../controllers/cart.controller')


cartRouter.post('/add-to-cart', protect, addToCart );

module.exports = cartRouter

