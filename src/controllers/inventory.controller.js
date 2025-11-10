"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStock = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new inventory success",
      metadata: await InventoryService.addStockInventory(req.body)
    }).send(res);
  };
}

module.exports = new InventoryController();
