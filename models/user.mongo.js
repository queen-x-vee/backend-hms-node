const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true // add createdAt and updatedAt timestamps
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;