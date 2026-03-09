"use strict";

const { SuccessResponse } = require("../core/success.response");
const { newUserService, checkLoginEmailTokenService } = require("../services/user.service");

class UserController {
    addUser = async (req, res, next) => {
        const response = await newUserService({
            email: req.body.email
        });

        new SuccessResponse(response).send(res);
    };

    checkLoginEmailToken = async (req, res, next) => {
        const { token = null } = req.query
        new SuccessResponse({
            message: "Check register email token success",
            metadata: await checkLoginEmailTokenService({
                token
            })
        }).send(res);
    };
}

module.exports = new UserController();
