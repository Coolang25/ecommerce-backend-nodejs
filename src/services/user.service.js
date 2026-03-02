'use strict';

const { ErrorResponse } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const USER = require("../models/user.model");
const { sendEmailToken } = require("./email.service");

const newUserService = async ({
    email = null,
    captcha = null
}) => {
    const user = await USER.findOne({ email }).lean();

    if (user) {
        return new ErrorResponse({
            message: "Email already exists"
        });
    }

    // Send OTP to email
    const result = await sendEmailToken({ email });

    return {
        message: "verify email user",
        metadata: {
            token: result
        }
    }
}

module.exports = {
    newUserService
}