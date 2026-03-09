'use strict';

const { ErrorResponse } = require("../core/error.response");
const USER = require("../models/user.model");
const shopModel = require("../models/shop.model");
const { sendEmailToken } = require("./email.service");
const { checkEmailToken } = require("./otp.service");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { createUser } = require("../models/repositories/user.repo");
const { getInfoData } = require("../utils");

const RoleShop = {
    SHOP: "SHOP",
    WRITE: "WRITE",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

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

const checkLoginEmailTokenService = async ({
    token
}) => {
    try {
        const { otp_token, otp_email: email } = await checkEmailToken({ token });
        if (!email) throw new ErrorResponse('Token not found');

        const hasUser = await findUserByEmailWithLogin({ email });
        if (hasUser) throw new ErrorResponse('Email already exists');

        const passwordHash = await bcrypt.hash(email, 10);
        const newUser = await createUser({
            usr_id: 1,
            usr_slug: 'xyz',
            usr_name: 'email',
            usr_password: passwordHash,
            usr_role: ''
        })

        if (newUser) {
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

            await KeyTokenService.createKeyToken({
                userId: newUser.usr_id,
                publicKey,
                privateKey
            });

            const tokens = await createTokenPair(
                { userId: newUser.usr_id, email },
                publicKey,
                privateKey
            );

            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ["usr_id", "usr_name", "usr_email"],
                        objects: newUser,
                    }),
                    tokens
                }
            };
        }

        return {
            code: 200,
            metadata: null,
        };

    } catch (error) {

    }
}

const findUserByEmailWithLogin = async ({
    email
}) => {
    const user = await USER.findOne({ usr_email: email }).lean();
    return user;
}

module.exports = {
    newUserService,
    checkLoginEmailTokenService
}