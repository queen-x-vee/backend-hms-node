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

async function updateProduct() {}

async function deleteProduct() {}

async function createNewProduct(req, res) {
    try {
       
        console.log(res.body)
        const {productName, quantity } = req.body;
       //console.log(req.body)
       let cart = await CartModel.findById(user);
       console.log(cart)
       /*if (!cart) {
         res.status(400).json({
           success: false,
           message: "Cart not found",
         });
       }
       res.status(200).json({
         success: true,
         message: "Product created successfully",
         cart,
       });
      /*const { productName, price, description, sideEffects, category, quantity } =
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
      });*/
      ;
    } catch (err) {
      res.status(500).json({
        success: false,
      });
    }
  }

async function removeProductFromCart() {}

async function getCart() {}

module.exports = {
  createProduct,
  getProducts,
  getProductByName,
  createNewProduct,
  updateProduct,
  deleteProduct,
  removeProductFromCart,
  getCart,
};
