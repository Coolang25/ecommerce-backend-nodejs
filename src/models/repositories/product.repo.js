"use strict";

const { Types } = require("mongoose");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");

const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: product_id,
    product_shop,
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: product_id,
    product_shop,
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
};
