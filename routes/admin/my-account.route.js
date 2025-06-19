const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../../controllers/admin/my-account.controller.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");
const upload = multer();

router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router;
