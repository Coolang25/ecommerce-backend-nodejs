const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middleware
app.use(morgan('dev')); // Logging middleware: combinded, dev, common, short, tiny
app.use(helmet()) // Security middleware
app.use(compression); // Compression middleware


// init db

// init routes
app.get('/', (req, res, next) => {
    const strCompress = 'Hello'
    return res.status(200).json({
        message: 'Welcome to WSV eCommerce API',
        metadata: strCompress.repeat(1000),
    });
});

// handle errors

module.exports = app;