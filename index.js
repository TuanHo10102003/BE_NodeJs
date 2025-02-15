const express = require('express');

const methodOverride = require("method-override")

const bodyParser = require("body-parser")

const flash = require("express-flash")

const cookieParser = require("cookie-parser")

const session = require("express-session")

require('dotenv').config()

const database = require("./config/database");

const systemConfig = require("./config/system")

database.connect();

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const app = express();

const port = process.env.PORT;

app.use(cookieParser('TUAN10102003'));
app.use(session({cookie: {maxAge: 60000}}))
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(bodyParser.urlencoded({ extended: false}));

app.use(methodOverride("_method"));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

//Route

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})