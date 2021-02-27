require("dotenv/config");
const express = require("express");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3500;
const AWS = require('aws-sdk')
// const storage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, " ");
//   },
// };

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer().single("video");

app.post("/upload", upload, (req, res) => {

    let myVideo = req.file.originalname.split('.')
    const fileType = myVideo[myVideo.length - 1]
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `video/1234.${fileType}`,
        Buffer: 
    };
    s3.upload(params, (error, data) => {

    })
  res.send({
    message: "working fine",
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
