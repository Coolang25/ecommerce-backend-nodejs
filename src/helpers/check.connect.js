'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECOND = 5000;

// Count connect
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of active connections: ${numConnections}`);
}

// Check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections based on CPU cores
        const maxConnections = numCores * 5; // Example: 5 connections per core

        console.log(`Number of active connections: ${numConnections}`);
        console.log(`Memory Usage: ${Math.round(memoryUsage / 1024 / 1024)} MB`);

        if (numConnections > maxConnections) {
            console.warn(`Warning: Number of connections (${numConnections}) exceeds the maximum limit (${maxConnections})`);
            // Notify admin or take action
        }
    }, _SECOND); // Monitor every 5 seconds

    const maxConnections = 100; // Example threshold
    const numConnections = mongoose.connections.length;
    if (numConnections > maxConnections) {
        console.warn(`Warning: Number of connections (${numConnections}) exceeds the maximum limit (${maxConnections})`);
    }
}

module.exports = {
    countConnect,
    checkOverload,
};