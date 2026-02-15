'use strict';

const { AuthFailureError } = require('../core/error.response');
const rbac = require('./role.middleware');

const grandAccess = (action, resource) => {

    return async (req, res, next) => {
        try {
            const rol_name = req.query.role;
            const permission = rbac.can(rol_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError('You do not have permission to access this resource');
            };

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    grandAccess
}