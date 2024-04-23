const express = require('express');


async function createNewUser(req, res){
    try{
        const {username, email, password, isAdmin} = req.body;
        if (!username ||!email ||!password ||!isAdmin){
            res.status(400).json({success: false, message: 'Please provide all required fields'})
        }
        const oldUser = await UserModel.findOne({$or: [{email}]})
        if (oldUser){
            res.status(400).json({success: false, message: 'An account with this email already exists'})
        }
        console.log('User created')

    } catch(err){
        res.status(500).json({success: false, message: err.message})
    }
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

function deleteUser(req, res){
    res.status(200).json({success: true, message: 'User deleted'})
}

function login(req, res){
    res.status(200).json({success: true, message: 'User logged in'})
}

function logout(req, res){
    res.status(200).json({success: true, message: 'User logged out'})
}

module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    logout
}