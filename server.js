const express = require("express");
const app = express();

//Routes
const video = require("./routes/index");

//Mount Router
app.use("/api/video", video);

const port = process.env.PORT || 3500;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
