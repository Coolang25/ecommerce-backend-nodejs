'use strict'

const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/shopDEV';
const { countConnect } = require('../helpers/check.connect'); // Import the countConnect function

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true); // Enable debug mode  
            mongoose.set('debug', { color: true }); // Enable debug mode with color coding
        }

        mongoose.connect(connectString, {
            maxPoolSize: 10, // Maximum number of connections in the pool
        }).then(() => {
            console.log('MongoDB connected successfully', countConnect());
        }).catch(err => {
            console.error('MongoDB connection error:', err);
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;