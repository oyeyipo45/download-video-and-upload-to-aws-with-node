const express = require("express");
const multer = require("multer");
const router = express.Router();

// const upload =

const { downloadVideo, uploadVideo } = require("../controllers/controllers.js");

router.get("/download", downloadVideo);
router.post("/upload", multer().single("video"), uploadVideo);

module.exports = router;
