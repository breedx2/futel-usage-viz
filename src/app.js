'use strict';

const port = 8080;
const express = require("express");
const app = express();

app.use(express.static("static"));
// if/when we webpack
//app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("hello there.");
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
