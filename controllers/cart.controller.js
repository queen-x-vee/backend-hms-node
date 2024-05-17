const CartModel = require('../models/cart.mongo');
const ProductModel = require('../models/product.mongo');
const UserModel = require('../models/user.mongo');

async function addToCart(req, res) {
  try {
    const { email, productName, quantity } = req.body;

    const user = await UserModel.findOne({ email });
    const product = await ProductModel.findOne({ productName });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const userId = user._id;
    const productId = product._id;
    const productPrice = product.price;
    const availableQuantity = product.quantity;

    if (quantity > availableQuantity) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock." });
    }

    let cart = await CartModel.findOne({ user: userId });

    if (cart) {
      const cartItem = cart.cartContents.find(item => item.item.equals(productId));

      if (cartItem) {
        const newQuantity = cartItem.quantity + quantity;

        if (newQuantity > availableQuantity) {
          return res.status(400).json({ message: "Total quantity in cart exceeds available stock." });
        }

        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * productPrice;
      } else {
        cart.cartContents.push({
          item: productId,
          quantity,
          price: productPrice,
          totalPrice: quantity * productPrice
        });
      }
    } else {
      cart = new CartModel({
        user: userId,
        cartContents: [{
          item: productId,
          quantity,
          price: productPrice,
          totalPrice: quantity * productPrice
        }]
      });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully." , cart});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  addToCart,
};
