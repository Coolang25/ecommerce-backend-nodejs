"use strict";
const { inventory } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: { inven_stock: -quantity },
    $push: {
      inven_reservations: {
        cartId,
        quantity,
        createOn: new Date()
      },
    },
  };
  const options = { upsert: true, new: true };

  return await inventory.updateOne(query, updateSet);
}

module.exports = {
  insertInventory,
};
