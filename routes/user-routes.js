const express = require('express')
const {createNewUser, loginUser, logInStatus, updateAdmin,getAllUsers,getAdmin, getCustomer, getNonAdminUsers} = require('../controllers/user.controller')
const { protect } = require('../middleware/auth.middleware')

const userRouter = express.Router()

// user routes
userRouter.post('/register', createNewUser) // register/sign-up/create user
userRouter.post('/login', loginUser) // login user
//userRouter.get('/logout', logoutUser) // logout user
userRouter.get('/loggedIn', logInStatus) // logout user
userRouter.get('/admin', getAdmin) // get user -admin
userRouter.get('/customers', getNonAdminUsers)
userRouter.get('/customer/:email', getCustomer) // get user -admin
userRouter.patch('/updateAdmin',protect, updateAdmin) // update user -admin
userRouter.get('/users', getAllUsers) // get all users -admin


module.exports = userRouter
