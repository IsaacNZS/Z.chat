const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");
const protectroute = require("../utils/auther");
const upload = require("../utils/multer");

router.get("/allmessage/:readerid", protectroute, controller.get);
router.get("/friends/:id", protectroute, controller.friends);
router.post("/addmessage/:readerid", protectroute, controller.post);

router.delete("/deletemessage/:id", protectroute, controller.del);

module.exports = router;
