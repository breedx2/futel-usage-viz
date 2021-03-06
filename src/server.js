'use strict';

// silly test server that is used basically only for development, isn't
// really required

const port = 8080;
import express from 'express';
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
