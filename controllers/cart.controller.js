const express = require("express");
const router = express.Router();
const CartModel = require("../models/cart.mongo");
const ProductModel = require("../models/product.mongo");
const UserModel = require("../models/user.mongo");

// POST endpoint to add a product to the cart
async function addToCart(req, res) {
  try {
    const { email, productName, quantity } = req.body;

    // Check if the user and product exist
    const userExists = await UserModel.findOne({ email });
    const productExists = await ProductModel.findOne({ productName });

    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }
    if (userExists && productExists) {
      const userId = userExists._id;
      const productId = productExists._id;
      const existingCartItem = await CartModel.findOne({
        user: userId,
        "cartContents.item": productId, 
      });

      if (existingCartItem) {
        // If product is already in the cart, update its quantity
        await CartModel.updateOne(
          { user: userId, "cartContents.item": productId },
          { $inc: { "cartContents.$.quantity": quantity } }
        );
      } else {
        // If the product is not in the cart, add it
        await CartModel.findOneAndUpdate(
          { user: userId },
          { $push: { cartContents: { item: productId, quantity: quantity } } },
          { upsert: true }
        );
      }

      res.status(200).json({ message: "Product added to cart successfully." });
    }

    /*if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await CartModel.findOne({ user: userId, 'cartContents.item': productId });

    if (existingCartItem) {
      // If product is already in the cart, update its quantity
      await CartModel.updateOne(
        { user: userId, 'cartContents.item': productId },
        { $inc: { 'cartContents.$.quantity': quantity } }
      );
    } else {
      // If the product is not in the cart, add it
      await CartModel.findOneAndUpdate(
        { user: userId },
        { $push: { cartContents: { item: productId, quantity: quantity } } },
        { upsert: true }
      );
    }

    res.status(200).json({ message: "Product added to cart successfully." });*/
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  addToCart,
};
