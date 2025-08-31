"use strict";

const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const slugify = require("slugify");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_stock: { type: Number, required: true },
    inven_location: { type: String, default: "unKnow" },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
