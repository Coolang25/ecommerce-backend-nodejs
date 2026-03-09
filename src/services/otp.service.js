'use strict';

const crypto = require("crypto");
const OTP = require("../models/otp.model");

const generateTokenRandom = async () => {
    const token = crypto.randomInt(0, Math.pow(2, 32));
    return token;
}

const newOtp = async ({ email }) => {
    const token = generateTokenRandom();
    const newToken = await OTP.create({
        otp_token: token,
        otp_email: email
    });

    return newToken;
}

const checkEmailToken = async ({
    token
}) => {
    const hasToken = await OTP.findOne({
        otp_token: token
    })

    if (!hasToken) throw new Error('Token not found');

    OTP.deleteMany({
        otp_token: token
    }).then()

    return token;
}

module.exports = {
    newOtp,
    checkEmailToken
}