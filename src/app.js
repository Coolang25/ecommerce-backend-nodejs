require("dotenv").config(); // Load environment variables from .env file
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// init middleware
app.use(morgan("dev")); // Logging middleware: combinded, dev, common, short, tiny
app.use(helmet()); // Security middleware
app.use(compression()); // Compression middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// test pubsub redis
// const productTest = require("./tests/product.test.js");
// require("./tests/inventory.test.js");
// productTest.purchaseProduct("product123", 2);

// init db
require("./dbs/init.mongodb.js"); // MongoDB connection
// const { checkOverload } = require('./helpers/check.connect'); // Check overload connections
// checkOverload(); // Start checking for overload connections

// init routes
app.use("/", require("./routes")); // Main route

// handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    status: "error",
    code: status,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
