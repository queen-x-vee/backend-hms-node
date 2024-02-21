// import user model and jsonwebtoken, bcrypt and dotenv packages
const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { sendMail, renderMessage } = require("../utils/mail");
require('dotenv').config()

// CREATE/REGISTER

// function to create user (register)
async function createUser (req, res) {
  try {
    // destructure user details from request body
    const {email, password, username} = req.body

    // validate user input
    if (!email || !password || !username) {
      return res.status(400).json({success: false, message: 'Please fill in the required fields'})
    }

    // check if user already exists
    const oldUser = await UserModel.findOne({$or: [{email}, {username}]})
    if (oldUser) {
      return res.status(400).json({success: false, message: 'User already exists'})
    }

    // access the uploaded file URL from req.file (uploaded by multer)
    const default_profile_url = 'https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
    const profile_picture_url = req.file ? req.file.path : default_profile_url;

    // create new user and save to database
    const newUser = await new UserModel({
      email, password, username, profile_picture: profile_picture_url
    })
    const userToSave = await newUser.save()

    // send a mail to user on successful registration
    const emailOption = {
      to: email,
      from: 'deBee Chat',
      subject: 'Registration Successful',
      html: await renderMessage('welcomeMessage.ejs', userToSave)
    }
    await sendMail(emailOption, res)

    /* USING JWT FOR AUTHENTICATION
    // issue a jwt on registration
    const token = jwt.sign({id: userToSave._id, email: userToSave.email}, process.env.KEY, {expiresIn: '1h'})
    
    res.status(201).json({success: true, message: token, user: userToSave})
    */

    // create a session and a cookie on registration
    req.session.user = {id: userToSave._id, email: userToSave.email, username: userToSave.username}
    res.cookie('user_id', userToSave._id, {maxAge: 3600000, path: '/'})
    // console.log(req.cookies)
    // console.log(req.sessionID)

    // send status message
    res.status(201).json({success: true, message: 'Registration successful', user: userToSave})

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// LOGIN

// function to login
async function login (req, res) {
  try {
    // destructure login details from request body
    const {email, username, password} = req.body
    // allow user to login with password and email or username or both
    if (!password && (!email || !username)) {
      return res.status(400).json({success: false, message: 'Enter your credentials'})
    }
    // check if user exists
    const user = await UserModel.findOne({$or: [{email}, {username}]}, '-__v')
    if (!user) {
      return res.status(404).json({success: false, message: 'User is not registered'})
    }
    // compare provided password with the hashed password from the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {

        /* USING JWT FOR AUTHENTICATION
        // // issue a jwt on login
        // const token = jwt.sign({id: user._id, email: user.email}, process.env.KEY, {expiresIn: '1h'})
        // res.status(200).json({success: true, message: token})
        */

        // check if user is verified
        if (!user.verified) {
          return res.status(403).json({success: false, message: 'User is not verified'})
        }

        // create a session and a cookie on login
        req.session.user = {id: user._id, email: user.email, username: user.username}
        res.cookie('user_id', user._id, {maxAge: 3600000, path: '/'})
        // console.log(req.cookies)
        // console.log(req.sessionID)

        // send status message
        res.status(200).json({success: true, message: 'Login successful'})

      } else {
        return res.status(401).json({success: false, message: 'Incorrect credentials'})
      }
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// LOGOUT

// function to logout
async function logout (req, res) {
  try {
    if (req.session) {
      // destroy the session
      req.session.destroy(err => {
        if (err) {
          console.log(err.message)
          res.status(500).json({success: false, message: 'Error logging out'})
        }

        // clear the cookie
        res.clearCookie('user_id')
        
        // send status message
        res.status(200).json({success: true, message: 'Logout successful'})
      })

    } else {
      return res.status(400).json({sucess: false, message: 'No session to destroy'})
    }
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// READ

// function to get all users
async function getUsers (req, res) {
  try {
    const users = await UserModel.find().select('-password -__v')
    res.status(200).json({success: true, users: users})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get a user by id
async function getUser (req, res) {
  try {
    // get id from req.params
    const id = req.params.user_id
    const user = await UserModel.findById(id, '-password -__v')
    // check if user exists
    if (!user) {
      return res.status(404).json({success: false, message: 'User does not exist'})
    }

    res.status(200).json({success: true, user: user})

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// UPDATE
async function updateUser (req, res) {
  try {
    // destructure user's input from the request body
    const {email, username, password, profile_picture} = req.body

    // get user_id from the user property of the request.session object
    const user_id = req.session.user.id
    // use the user_id to find the user
    const user = await UserModel.findById(user_id)

    // conditions to check the user's input and modify the data in the database accordingly
    if (email) user.email = email
    if (username) user.username = username
    if (password) user.password = password
    if (req.file) {
      const profile_picture_url = req.file.path
      user.profile_picture = profile_picture_url
    }

    // save the modifications (save will trigger the presave middleware in user model to hash the password too)
    const updatedUser = await user.save()

    res.status(200).json({success: true, updatedUser})
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// DELETE
async function deleteUser (req, res) {
  try {
  
    // get user_id from the user property of the request.session object
    const user_id = req.session.user.id

    // find the user by id and update
    const deletedUser = await UserModel.findByIdAndDelete(user_id)

    res.status(200).json({success: true, message: `User with id ${deletedUser._id} has been deleted`})

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createUser, login, logout, getUsers, getUser, updateUser, deleteUser}