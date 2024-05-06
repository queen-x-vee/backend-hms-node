const express = require('express')
const {createNewUser, login, updateUser,getAllUsers,getUser} = require('../controllers/user.controller')

const userRouter = express.Router()

// user routes
userRouter.post('/register', createNewUser) // register/sign-up/create user
userRouter.post('/login', login) // login user
userRouter.put('/user/:id', updateUser) // update user -admin
userRouter.get('/users', getAllUsers) // get all users -admin
userRouter.get('/user/:id', getUser) // get user -admin


module.exports = userRouter
