const express = require('express')
const app = express()

const port = process.env.PORT || 3500


app.get("/upload",(req, res) => {
res.send("working fine")
})
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})