const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cartId : {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }, 
    cartContents: [{
        type: String,
        ref: 'Product'
    }]
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;