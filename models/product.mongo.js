const mongoose = require('mongoose');

const productSchema =  new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
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
    sideEffects: {
        type: String,
        required: true
    }
    
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;