'use strict'

// Level 0
// const config = {
//     app: {
//         port: process.env.PORT || 3000,
//     },
//     db: {
//         host: process.env.DB_HOST || 'localhost',
//         port: process.env.DB_PORT || 27017,
//         name: process.env.DB_NAME || 'shopDEV',
//     },
// }

// Level 1

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDEV',
    },
}

const pro = {
    app: {
        port: process.env.PRO_DB_PORT || 3000,
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'shopDEV',
    },
}

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];