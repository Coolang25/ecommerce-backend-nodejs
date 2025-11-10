'use strict';

//!dmbg
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_userId: {
        type: Number,
        retrue: true,
    },
    order_checkout: {
        type: Object,
        default: {},
    },
    order_shipping: {
        type: Object,
        default: {},
    },
    order_payment: {
        type: Object,
        default: {},
    },
    order_products: {
        type: Array,
        require: true,
    },
    order_trackingNumber: {
        type: String,
        default: '#0000118052025',
    },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'],
        default: 'pending',
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);