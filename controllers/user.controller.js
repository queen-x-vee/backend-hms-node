const UserModel = require("../models/user.mongo");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const e = require("express");

/*const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
    }
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: '1h'
    }
    return jwt.sign(payload, secret, options)
}*/

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign({ id }, secret, options);
};

async function createNewUser(req, res) {
  try {
    const { username, email, password, isAdmin } = req.body;
    if (!username || !email || !password || isAdmin === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      email,
      isAdmin,
      password: hashedPassword,
      id: uuidv4(),
    });

    const token = generateToken(newUser._id);

    const { _id, id } = newUser;
    res.status(201).json({
      _id,
      id,
      username,
      email,
      isAdmin,
      success: true,
      message: "User created",
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "User not found, please sign up" });
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    const token = generateToken(user._id);
    /*res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "none",
      secure: true,
    });*/

    if (user && passwordIsCorrect) {
      const { _id, id, username, email, isAdmin } = user;
      res.status(200).json({
        _id,
        id,
        username,
        email,
        isAdmin,
        success: true,
        message: "User logged in successfully",
        token,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "email or password incorrect" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/*function logoutUser(req, res) {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
}*/

async function logInStatus(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(false)
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified) {
            return res.json(true)
        }else {
            return res.json(false)
        }
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "You are not authorized , please login"
        });
    }
}

function getAllUsers(req, res) {
  res.status(200).json({ success: true, message: "All users retrieved" });
}

async function getAdmin(req, res) {
  const user = await UserModel.findById(req.user._id);
  if (user) {
    const { _id, id, username, email, isAdmin } = user;
    res.status(200).json({
      _id,
      id,
      username,
      email,
      isAdmin,
      success: true,
      message: "User retrieved",
    });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
}

async function getCustomer(req, res) {
  try {
    const {email} = req.params; 
    const user = await UserModel.findOne({ email });
    if (user) {
        console.log(user)
        const { _id, id, username, email, isAdmin } = user;
        res.status(200).json({
          _id,
          id,
          username,
          email,
          isAdmin,
          success: true,
          message: "Customer retrieved",
        });
      } else {
        res.status(404).json({ success: false, message: "Customer not found" });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateAdmin(req, res) {
  const user = await UserModel.findById(req.user._id);

  if (user) {
    const { username, email, isAdmin } = user;
    user.username = req.body.username || username;
    user.email = req.body.email || email; 
    user.isAdmin = req.body.isAdmin || isAdmin;

    const updatedUser = await user.save()
    res.status(200).json({
      user:updatedUser
    })
  }else{
    res.status(404).json({
      message: 'User not found'
    })
  }
}

async function getNonAdminUsers(req, res) {
  try {
    const nonAdminUsers = await UserModel.find({ isAdmin: false })
      .select('-password') // Exclude password from the result
      .lean(); // Convert to plain JavaScript objects for better performance

    res.status(200).json({
      success: true,
      message: "Non-admin users retrieved successfully",
      users: nonAdminUsers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving non-admin users",
      error: err.message
    });
  }
}

module.exports = {
  createNewUser,
  getAllUsers,
  getAdmin,
  getCustomer,
  updateAdmin,
  loginUser,
  //logoutUser,
  logInStatus,
  getNonAdminUsers
};
