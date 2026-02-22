"use strict";

const express = require("express");
const { newResource, newRole, listResources, listRoles } = require("../../controllers/rbac.controller");
const { grandAccess } = require("../../middlewares/rbac");
const router = express.Router();

router.post("/resource", newResource);
router.post("/role", newRole);
router.get("/resources", listResources);
router.get("/roles", listRoles);

module.exports = router;
