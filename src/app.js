require('dotenv').config(); // Load environment variables from .env file
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middleware
app.use(morgan('dev')); // Logging middleware: combinded, dev, common, short, tiny
app.use(helmet()) // Security middleware
app.use(compression()); // Compression middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


// init db
require('./dbs/init.mongodb.js'); // MongoDB connection
// const { checkOverload } = require('./helpers/check.connect'); // Check overload connections
// checkOverload(); // Start checking for overload connections

// init routes
app.use('/', require('./routes')); // Main route

// handle errors

module.exports = app;