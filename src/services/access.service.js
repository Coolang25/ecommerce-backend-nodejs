'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                });

                console.log({ privateKey, publicKey });

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                });

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'Failed to create public key',
                        status: 'error',
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                console.log('Public Key Object:', publicKeyObject);

                // Create the access token and refresh token
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey);
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
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    };
}

module.exports = AccessService