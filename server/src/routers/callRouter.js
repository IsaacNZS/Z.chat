const express = require("express");
const router = express.Router();
const controller = require("../controllers/callController");

router.post("/token", controller.generateToken);

module.exports = router;
