const UserModel = require("../models/user.mongo");
const CartModel = require("../models/cart.mongo");
const ProductModel = require("../models/product.mongo");
const { json } = require("body-parser");

async function createCart(req, res) {
  try {
    const { email } = req.params;
    const { productName, quantity, price } = req.body;
    if (!email || !productName || !quantity || !price) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const user = await UserModel.findOne({ email });
    // If the user doesn't have a cart, create a new one
    const product = await ProductModel.findOne({ productName });
    //console.log(product)
    if (user && product) {
      const newCart = await CartModel.create({
        user: user,
        cartContents: [{
            item: product,
            quantity: quantity,   
        }]
      });
      res.status(201).json({
        success: true,
        message: "Cart created successfully",
        newCart,
      }); 
    } 
    else {
      res.status(400).json({
        success: false,
        message: "User or product not found",
      });
    }
    
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
}

module.exports = {
  createCart,
};
