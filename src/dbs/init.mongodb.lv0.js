'use strict'

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/shopDEV';
mongoose.connect(connectString).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// dev
if (1 === 1) {
    mongoose.set('debug', true); // Enable debug mode  
    mongoose.set('debug', { color: true }); // Enable debug mode with color coding
}

module.exports = mongoose;