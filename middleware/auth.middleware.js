const UserModel = require("../models/user.mongo");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


/*async function protect (req, res){
    try {
        const token = req.headers.authorization;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "You are not authorized to perform this action"
        });
    }
}*/

async function protect(req, res, next){
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized , please login"
            });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
       const user = await UserModel.findById(verified.id).select("-password");
       if (!user.isAdmin) {
        return res.status(401).json({
               success: false,
               message: "Only admin can access this route"
           });
       }
       /*if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
       }*/
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "You are not authorized to perform this action"
        });
    }}

module.exports = {
    protect
}