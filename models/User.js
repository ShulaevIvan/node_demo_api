const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { 
        type: String,
        default: '',
        require: true,
        unique: true
    },
    passwordHash: {
        type: String,
        default: '',
        require: true,
    },
    name	: {
        type: String,
        default: '',
        require: true,
    },
    contactPhone: {
        type: String,
        default: '',
        require: false,
    }
});

module.exports = mongoose.model('User', userSchema);