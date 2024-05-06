const UserModel = require('../models/user.mongo')
const { v4: uuidv4 } = require('uuid');



async function createNewUser(req, res){
    try{
        const {username, email, password, isAdmin} = req.body;
        if (!username ||!email ||!password ||!isAdmin){
            res.status(400).json({success: false, message: 'Please provide all required fields'})
        }
        if(password.length < 6){
            res.status(400).json({success: false, message: 'Password must be at least 6 characters long'})
        }

        const userExists = await UserModel.findOne({email})
        if (userExists){
            res.status(400).json({success: false, message: 'An account with this email already exists'})
        }

        const newUser = await UserModel.create({username, email, password, isAdmin, id: uuidv4()})
        if (newUser){
            const {_id, id, username, email, isAdmin} = newUser
            res.status(201).json({
                _id, 
                id,
                username, 
                email, 
                isAdmin,
                success: true, 
                message: 'User created'})
        }else{
            res.status(400).json({success: false, message: 'Something went wrong'})
        }

    } catch(err){
        res.status(500).json({success: false, message: err.message})
    }
}

async function login(req, res){
    try{
        const {email, password} = req.body;
        if (!email ||!password){
            res.status(400).json({success: false, message: 'Please provide all required fields'})
        }
        const user = await UserModel.findOne({email})
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
}

function logout(req, res){
    res.status(200).json({success: true, message: 'User logged out'})
}

function getAllUsers(req, res){
    res.status(200).json({success: true, message: 'All users retrieved'})
}

function getUser(req, res){
    res.status(200).json({success: true, message: 'User retrieved'})
}

function updateUser(req, res){
    res.status(200).json({success: true, message: 'User updated'})
}



module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    updateUser,
    login,
    logout
}