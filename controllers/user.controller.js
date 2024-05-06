const UserModel = require("../models/user.mongo");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
    if (!username || !email || !password || !isAdmin) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const newUser = await UserModel.create({
      username,
      email,
      isAdmin,
      password,
      id: uuidv4(),
    });

    const token = generateToken(newUser._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "none",
      secure: true,
    });

    if (newUser) {
      const { _id, id, username, email, isAdmin } = newUser;
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
    } else {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
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
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        sameSite: "none",
        secure: true,
      });

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
        res.status(400).json({ success: false, message: "email or password incorrect" });
      }
  
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

function logoutUser(req, res) {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
      });
     return res.status(200).json({ success: true, message: "User logged out successfully" });
}

function getAllUsers(req, res) {
  res.status(200).json({ success: true, message: "All users retrieved" });
}

function getUser(req, res) {
  
}

function updateUser(req, res) {
  res.status(200).json({ success: true, message: "User updated" });
}

module.exports = {
  createNewUser,
  getAllUsers,
  getUser,
  updateUser,
  loginUser,
  logoutUser,
};
