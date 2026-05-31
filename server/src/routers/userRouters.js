const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const protectroute = require("../utils/auther");
const upload = require("../utils/multer");

router.post("/auth/register", controller.register);
router.post("/auth/login", controller.login);
router.post("/auth/logout", controller.logout);
router.post("/savetoken", protectroute, controller.tokenpost);

router.get("/", protectroute, controller.userInfo);
router.get("/allusers", protectroute, controller.get);
router.get("/profile/:id", protectroute, controller.profile);

router.patch(
  "/edituser/:id",
  protectroute,
  upload.single("image"),
  controller.patch,
);
router.delete("/deleteuser/:id", protectroute, controller.del);

module.exports = router;
