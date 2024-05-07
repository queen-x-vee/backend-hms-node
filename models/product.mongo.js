const mongoose = require('mongoose');

const productSchema =  new mongoose.Schema({
    productId: {
        type: String ,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sideEffects: [String]
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;