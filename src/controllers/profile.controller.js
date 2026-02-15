"use strict";

const { SuccessResponse } = require("../core/success.response");
const dataProfiles = [
    {
        usr_id: 1,
        usr_name: "CR7",
        usr_avt: 'image.com/user/1'
    },
    {
        usr_id: 2,
        usr_name: "Messi",
        usr_avt: 'image.com/user/2'
    },
    {
        usr_id: 3,
        usr_name: "Neymar",
        usr_avt: 'image.com/user/3'
    }
]

class ProfileController {
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all profiles",
            metadata: dataProfiles
        }).send(res);
    };

    profile = async (req, res, next) => {
        new SuccessResponse({
            message: "Get one profile",
            metadata: {
                usr_id: 2,
                usr_name: "Messi",
                usr_avt: 'image.com/user/2'
            }
        }).send(res);
    };
}

module.exports = new ProfileController();