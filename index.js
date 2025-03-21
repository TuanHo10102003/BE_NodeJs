const express = require("express");

const path = require("path");

const methodOverride = require("method-override");

const bodyParser = require("body-parser");

const flash = require("express-flash");

const cookieParser = require("cookie-parser");

const session = require("express-session");

require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

database.connect();

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const { default: mongoose } = require("mongoose");

const app = express();

const port = process.env.PORT;

app.use(cookieParser("TUAN10102003"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));
app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//Route

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
