"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("./product.service.xxx");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Invalid discount date");
    }

    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    productId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    console.log("Found discount:", foundDiscount);
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: {
          product_shopId: shopId,
          isPublished: true,
        },
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      console.log("call");
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: {
          _id: { $in: discount_product_ids },
          product_shop: shopId,
          isPublished: true,
        },
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      select: ["discount_code", "discount_name", "discount_description"],
      model: discount,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, shopId, products, userId }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
      model: discount,
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exists");
    }

    const {
      discount_type,
      discount_value,
      discount_users_used,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_is_active,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new BadRequestError("Discount is not active");
    }

    if (!discount_max_uses) {
      throw new BadRequestError("Discount are out");
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount has expired");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          "Total order value is less than minimum required"
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const useUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (useUserDiscount) {
        // TODO
      }
    }

    console.log("Found discount:", foundDiscount);

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : (discount_value / 100) * totalOrder;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_code: codeId,
    });
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_code: codeId,
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exists");
    }

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
