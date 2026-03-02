"use strict";

const { SuccessResponse } = require("../core/success.response");
const { newUserService } = require("../services/user.service");

class UserController {
    addUser = async (req, res, next) => {
        const response = await newUserService({
            email: req.body.email
        });

        new SuccessResponse(response).send(res);
    };

    checkRegisterEmailToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Check register email token success",
            metadata: await UserService.checkRegisterEmailToken(req.body)
        }).send(res);
    };
}

module.exports = new UserController();
