const UserModel = require("../models/user.mongo");
const jwt = require("jsonwebtoken");

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

async function protect(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized , please login",
      });
    } 
    try {
    console.log('baby', token, "token");
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(verified.id).select("-password");
      console.log(user, "user");
      if (!user.isAdmin) {
        return res.status(401).json({
          success: false,
          message: "Only admin can access this route",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error, "error");
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

   

    
   
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }
}

module.exports = {
  protect,
};
