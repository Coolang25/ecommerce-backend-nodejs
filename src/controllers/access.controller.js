"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    console.log("call 1");
    new SuccessResponse({
      message: "Logout successful",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registration successful",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
