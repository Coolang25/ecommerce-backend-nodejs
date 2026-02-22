'use strict';

const { SuccessResponse } = require("../core/success.response");
const { createRole, createResource, resourceList, roleList } = require("../services/rbac.service");

const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: "Create new role success",
        metadata: await createRole(req.body)
    }).send(res);
};

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: "Create new resource success",
        metadata: await createResource(req.body)
    }).send(res);
};

const listRoles = async (req, res, next) => {
    new SuccessResponse({
        message: "List roles success",
        metadata: await roleList(req.query)
    }).send(res);
};

const listResources = async (req, res, next) => {
    new SuccessResponse({
        message: "List resources success",
        metadata: await resourceList(req.query)
    }).send(res);
};

module.exports = {
    newRole,
    newResource,
    listRoles,
    listResources
}