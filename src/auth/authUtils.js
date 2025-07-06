'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days', // Access token valid for 2 days
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error('Access token verification failed');
                console.error(err);
            } else {
                console.log('Access token is valid:', decoded);
            }
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw new Error('Error creating token pair');
    }
}

module.exports = {
    createTokenPair,
}