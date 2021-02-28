require("dotenv/config");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3500;
const AWS = require("aws-sdk");
// const storage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, " ");
//   },
// };
AWS.config.setPromisesDependency();
  
const s3 = new AWS.S3({
  
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer().single("video");

app.post("/upload", upload, (req, res) => {
  
  let video = req.file
  let myVideo = req.file.originalname.split(".");
  const fileType = myVideo[myVideo.length - 1];
  const params = {
    ACL: "public-read",
    Bucket: process.env.BUCKET_NAME,
    Key: `video/1234.${fileType}`,
    //Body: fs.createReadStream(req.file.path),
    Body: req.file.buffer,
  };
  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    const locationUrl = data.Location;
      console.log(locationUrl, "location");
      console.log(data, "data");
    res.status(200).send(data);
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
