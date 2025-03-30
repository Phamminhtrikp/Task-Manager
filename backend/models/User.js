const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImgUrl: {
        type: String,
        default: null, // Default image URL
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member', // Role-based access control
    },
    
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);