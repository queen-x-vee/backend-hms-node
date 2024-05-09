//create or add product
//get all products
//update product stock or quantity when buyer makes a purchase
//update product details
//delete product if need be

const express = require('express');
const { createProduct, getProducts, getProductByName, createNewProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

const productRouter = express.Router();

productRouter.post('/create',  createProduct);
productRouter.post('/createNewCart',  createNewProduct);
productRouter.get('/all', getProducts);
productRouter.get('/:name', protect, getProductByName);
//productRouter.post('/addToCart', protect, addProductToCart);
productRouter.patch('/update/:id', protect,updateProduct);
productRouter.delete('/delete/:id', protect, deleteProduct);

module.exports = productRouter;