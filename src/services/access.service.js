'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            const hodelShop = await shopModel.findOne({ email }).lean();
            if (hodelShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already exists',
                    status: 'error',
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);
            console.log('call 1');
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            });

            console.log('call 2');

            if (newShop) {
                // create privateKey and publicKey for the shop
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     },
                // });

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log({ privateKey, publicKey });

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                });

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'Failed',
                        status: 'error',
                    }
                }

                // Create the access token and refresh token
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
                console.log('Tokens created:', tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], objects: newShop }),
                        tokens
                    },
                };
            }

            return {
                code: 200,
                metadata: null,
            };

        } catch (error) {
            console.error('Error in signUp:', error);
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    };
}

module.exports = AccessService