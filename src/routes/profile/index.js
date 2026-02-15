"use strict";

const express = require("express");
const { profiles, profile } = require("../../controllers/profile.controller");
const { grandAccess } = require("../../middlewares/rbac");
const router = express.Router();

// admin
router.get("/viewAny", grandAccess('readAny', 'profile'), profiles);

// shop
router.get("/viewOwn", grandAccess('readOwn', 'profile'), profile);

module.exports = router;
