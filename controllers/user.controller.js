const express = require('express');


function createNewUser(req, res){
    res.status(200).json({success: true, message: 'New user created'})
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