"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => Types.ObjectId(id);

const getInfoData = ({ fields = [], objects = {} }) => {
  return _.pick(objects, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
};

const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((field) => [field, 0]));
};

const removeUndefinedObject = (obj = {}) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const nestedObject = updateNestedObjectParser(obj[key]);
      Object.keys(nestedObject).forEach((nestedKey) => {
        final[`${key}.${nestedKey}`] = nestedObject[nestedKey];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
