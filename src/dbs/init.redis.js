'use strict';

const redis = require('redis');
const { RedisErrorResponse } = require('../core/error.response');

let client = {};
let statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    ERROR: 'error',
    RECONNECT: 'reconnecting',
}
let connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        en: 'Redis connection error',
        vn: 'Lỗi kết nối Redis'
    }
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponse(REDIS_CONNECT_MESSAGE.message.en, REDIS_CONNECT_MESSAGE.code);
    }, REDIS_CONNECT_TIMEOUT);
}

const handleEventRedis = ({
    connectionRedis
}) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('Redis connected >>>>');

        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('Redis disconnected');
        // connect retry
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.error('Redis error:', err);
        // connect retry
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('Redis reconnecting');
        clearTimeout(connectionTimeout);
    });
}

const initRedis = async () => {
    const instanceRedis = redis.createClient({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379
        },
        password: process.env.REDIS_PASSWORD || undefined,
        username: process.env.REDIS_USERNAME || undefined
    });

    client.instanceConnect = instanceRedis;
    handleEventRedis({ connectionRedis: instanceRedis });

    await instanceRedis.connect();
};

const getRedis = () => client;

const closeRedis = () => {
    client.instanceConnect.quit();
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}