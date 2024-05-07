const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],

    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true, // remove whitespace from beginning and end of string
        lowercase: true, // convert all characters to lowercase
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    photo:{
        type: String,
        default: 'https://pixabay.com/vectors/doctor-avatar-stethoscope-black-307970/'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: [{
        type: String,
        ref: 'Cart'
    }]
}, {
    timestamps: true // add createdAt and updatedAt timestamps
});
userSchema.pre('save', async function(next){
    if (this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;