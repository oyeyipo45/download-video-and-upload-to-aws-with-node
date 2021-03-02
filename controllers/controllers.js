const AWS = require("aws-sdk");
const fetch = require("node-fetch");
require("dotenv/config");
const fs = require("fs");
const path = require("path");

AWS.config.setPromisesDependency();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// @desc    Download Video
// @route   GET /api/video/download
// @access  Public
exports.downloadVideo = async (req, res) => {
  const url =
    "https://us02web.zoom.us/rec/download/oHgnaHJ8UCdLLiO_4DKXi0nMLYSK15p5gfUDojWDUMF-EokYB4omPRvsEEL73Q5iOS4JKhopdQpFYaRT.cgJoL5cOC6jiAApY?access_token=eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI4OGM1YjZiNi1hNzE4LTQwMmEtYjg2Yy05Y2Q0MTJhZGM5N2UifQ.eyJ2ZXIiOjcsImF1aWQiOiI1NjNiNDQxYjAwNmJmMDg1OTEyNjg0YmIxYjY0ZDUwNiIsImNvZGUiOiJ4TTUyUzZpZVZWX3d6RUgybTlmUzZ5eVFsX25GOXZiZkEiLCJpc3MiOiJ6bTpjaWQ6WU5oNmhKV3VRR3lwcDBzQlY3QmJyQSIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJ3ekVIMm05ZlM2eXlRbF9uRjl2YmZBIiwibmJmIjoxNjE0NjkwMzQ1LCJleHAiOjE2MTQ2OTM5NDUsImlhdCI6MTYxNDY5MDM0NSwiYWlkIjoiNUJCTDR6RHZSamF2d0ZCMnkzdWxPZyIsImp0aSI6IjJmZGU0MjU1LWM5MmItNDFlZS1hZjgwLTA3NzIxMWMwOTE2NCJ9.2RiNzeYea7VivSqpBDelZ-BRPRXcy1IBAGEZxXkU8WnwzV5ayw4QMUDzirMT6rZmnY7RJB5wsTWYUTksub7ccw";

  async function download(downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      const buffer = await response.buffer();

      fs.writeFile(`./zoom/zoom.mp4`, buffer, () => {
        console.log("finished downloading video!");
        return res.status(200).json({ success: true });
      });
      
    } catch (error) {
      console.log(error);
    }
  }
  download(url);
};

// @desc    Upload Video To AWS S3 BUCKET
// @route   POST /api/video/upload
// @access  Public
exports.uploadVideo = async (req, res) => {
  try {
    const filePath = path.resolve("zoom/zoom.mp4");
    const params = {
      ACL: "public-read",
      Bucket: process.env.BUCKET_NAME,
      Key: `video/zoom.mp4`,
      Body: fs.createReadStream(filePath),
    };
    s3.upload(params, (error, data) => {
      if (error) {
        res.status(500).send(error);
      }

      //upload video to aws
      if (data) {
        const locationUrl = data.Location;
        //delete file after upload
        fs.unlinkSync(filePath);
        return res.status(200).json({
          message: "Video has been successfully Uploaded to Aws",
          url: locationUrl,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
