const express = require('express');
require('dotenv').config()

const database = require("./config/database");

database.connect();

const route = require('./routes/client/index.route');

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