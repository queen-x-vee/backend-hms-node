//each buyer should have a profile

//there should be a list of buyers which only admin should have access to

const express = require('express')

const cartRouter = express.Router()

const { protect} = require('../middleware/auth.middleware')
const { createCart} = require('../controllers/cart.controller')


cartRouter.post('/create/:email', protect, createCart);

module.exports = cartRouter

