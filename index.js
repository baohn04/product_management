const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
require("dotenv").config();

const database = require("./config/database.js");

const systemConfig = require("./config/system.js");
const route = require("./routes/client/index.route.js");
const routeAdmin = require("./routes/admin/index.route.js");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));

//Flash
app.use(cookieParser('JKJHKAJSHDADGAS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
