const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config()

const route = require('./routes/client/index.route');

mongoose.connect('mongodb://127.0.0.1:27017/product-management');

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

//Route

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})