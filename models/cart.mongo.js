const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the CartItem sub-schema
const CartItemSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.'],
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  }
}, {
  _id: false // Disable the creation of an _id field for each subdocument
});

// Define the Cart schema
const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartContents: [CartItemSchema],
  totalCartPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price can not be less then 0.'],
    default: 0,
  }
}, {
  timestamps: true,
});

// Create a method to calculate the total price for each item
CartSchema.methods.calculateTotalPrice = function() {
  this.cartContents.forEach(cartItem => {
    cartItem.totalPrice = cartItem.quantity * cartItem.price;
  });
};

// Create a method to calculate the total cart price
CartSchema.methods.calculateTotalCartPrice = function() {
  this.totalCartPrice = this.cartContents.reduce((total, cartItem) => {
    return total + cartItem.totalPrice;
  }, 0);
};

// Create a pre-save hook to update the total price before saving
CartSchema.pre('save', function(next) {
  this.calculateTotalPrice();
  this.calculateTotalCartPrice();
  next();
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
