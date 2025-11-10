"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockInventory({
    stock,
    productId,
    shopId,
    location = 'HCM'
  }) {
    const product = getProductById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const query = {
      inventory_productId: productId,
      inventory_shopId: shopId
    };

    const updateSet = {
      $inc: { inventory_stock: stock },
      $set: { inventory_location: location }
    };

    const options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(
      query,
      updateSet,
      options
    );
  }
}

module.exports = InventoryService;
