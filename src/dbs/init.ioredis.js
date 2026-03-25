'use strict';

const Redis = require('ioredis');
const { RedisErrorResponse } = require('../core/error.response');

let clients = {};
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
        console.log('IORedis connected >>>>');

        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('IORedis disconnected');
        // connect retry
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.error('IORedis error:', err);
        // connect retry
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('IORedis reconnecting');
        clearTimeout(connectionTimeout);
    });
}

const init = async ({
    IOREDIS_IS_ENABLED,
    IOREDIS_HOST = process.env.REDIS_CACHE_HOST,
    IOREDIS_PORT = 6379,
}) => {
    if (IOREDIS_IS_ENABLED) {
        const instanceRedis = new Redis({
            host: IOREDIS_HOST,
            port: IOREDIS_PORT
        })

        clients.instanceConnect = instanceRedis;
        handleEventRedis({ connectionRedis: instanceRedis });
    }
};

const getIORedis = () => clients;

const closeIORedis = () => {
    clients.instanceConnect.quit();
}

module.exports = {
    init,
    getIORedis,
    closeIORedis
}