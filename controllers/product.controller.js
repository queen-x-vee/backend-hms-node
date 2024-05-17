const ProductModel = require("../models/product.mongo");
const CartModel = require("../models/cart.mongo");

async function createProduct(req, res) {
  try {
    const { productName, price, description, sideEffects, category, quantity } =
      req.body;
    if (
      !productName ||
      !price ||
      !description ||
      !sideEffects ||
      !category ||
      !quantity
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const productExists = await ProductModel.findOne({ productName });
    if (productExists) {
      res.status(400).json({
        success: false,
        message: "A product with this name already exists",
      });
    }
    const newProduct = await ProductModel.create({
      productName,
      price,
      description,
      sideEffects,
      category,
      quantity,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      newProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
}

async function getProducts(req, res) {
  try {
    const products = await ProductModel.find().select("-__v");
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getProductByName(req, res) {
  try {
    const productName = req.params.name;
    if (!productName) {
      res.status(400).json({
        success: false,
        message: "Please provide a product name",
      });
    }
    const product = await ProductModel.findOne({ productName }).select("-__v");
    console.log(product);
    if (product) {
      res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function updateProduct(req, res) {
  const product = await ProductModel.findOne(req.params.productName)
  if (product){
    const { productName, price, description, sideEffects, category, quantity } = product
    product.productName = req.body.productName || productName
    product.price = req.body.price || price
    product.description = req.body.description || description
    product.sideEffects = req.body.sideEffects || sideEffects
    product.category = req.body.category || category
    product.quantity = req.body.quantity || quantity

    const updatedProduct = await product.save();
    res.status(200).json({
      message: 'Product successfully updated',
      product: updatedProduct

    })
    
  }
}


async function deleteProduct() {}


async function removeProductFromCart() {}

async function getCart() {}

module.exports = {
  createProduct,
  getProducts,
  getProductByName,
  updateProduct,
  deleteProduct,
  removeProductFromCart,
  getCart,
};
