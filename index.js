const express = require("express");
const path = require("path");
const http = require('http');
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');
const { Server } = require("socket.io");
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

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io; // Biến toàn cục của socketIO

//Flash
app.use(cookieParser('JKJHKAJSHDADGAS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// routes
route(app);
routeAdmin(app);
// 404
app.get("*", (req, res) => { // * là các trường hợp route còn lại
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  });
});

server.listen(port, () => { // đổi sang sever để tích hợp socketIO thay vì app
  console.log(`Example app listening on port ${port}`);
});