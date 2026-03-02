'use strict';

//!dmbg
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DOCUMENT_NAME = 'template';
const COLLECTION_NAME = 'templates';

// Declare the Schema of the Mongo model
var templateSchema = new Schema({
    tem_id: { type: Number, require: true },
    tem_name: { type: String, require: true },
    tem_status: { type: String, default: 'active' },
    tem_html: { type: String, require: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, templateSchema);