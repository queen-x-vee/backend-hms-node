//create or add product
//get all products
//update product stock or quantity when buyer makes a purchase
//update product details
//delete product if need be

const express = require('express');
const { createProduct, getProducts, getProductByName, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

const productRouter = express.Router();

productRouter.post('/create', createProduct);
productRouter.get('/all', getProducts);
productRouter.get('/:name',  getProductByName);
productRouter.patch('/update/:id', updateProduct);
productRouter.delete('/delete/:id', deleteProduct);

module.exports = productRouter;