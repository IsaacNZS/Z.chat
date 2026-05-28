const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");
const protectroute = require("../utils/auther");

router.get("/allmessage/:readerid", protectroute, controller.get);
router.get("/friends/:id", protectroute, controller.friends);
router.post("/addmessage/:readerid", protectroute, controller.post);
router.patch("/editmessage/:id", protectroute, controller.patch);
router.delete("/deletemessage/:id", protectroute, controller.del);

module.exports = router;
