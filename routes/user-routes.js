const express = require('express')
const {createNewUser} = require('../controllers/user.controller')

const userRouter = express.Router()

// user routes
userRouter.post('/register', createNewUser) // register/sign-up/create user



module.exports = userRouter
