const User = require("../../models/user.model.js");
const Cart = require("../../models/cart.model.js");
const ForgotPassword = require("../../models/forgot-password.model.js");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.js");
const sendMailHelper = require("../../helpers/sendMail.js");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  req.body.password = md5(req.body.password); // Mã hóa password

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  req.flash("success", "Đăng ký thành công!");
  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  //Đăng nhập thành công
  res.cookie("tokenUser", user.tokenUser);

  await User.updateOne({ _id: user.id }, { statusOnline: "online" });

  _io.once('connection', (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
  });

  // Lưu user_id vào collection carts
  await Cart.updateOne({
    _id: req.cookies.cartId
  }, {
    user_id: user.id
  });

  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne({ _id: res.locals.user.id }, { statusOnline: "offline" });
  _io.once('connection', (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", res.locals.user.id);
  });
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  // Step 1: Tạo mã OTP và lưu OTP, email vào collection forgot-password
  const otp = generateHelper.generateRandomNumber(6);

  const objectForgotPassword = { 
    email: email,
    otp: otp,
    expireAt: Date.now()
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  
  // Step 2: Gửi mã OTP qua email của user
  const subject = `Mã OTP xác minh lấy lại mật khẩu`;
  const html = `
    OTP là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút!
  `;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
    email: email
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result) {
    req.flash("error", "OTP không hợp lệ!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  const user = await User.findOne({
    email: email
  })

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({
    tokenUser: tokenUser,
  }, {
    password: md5(password)
  });

  req.flash("success", "Đổi mật khẩu thành công");
  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info.pug", {
    pageTitle: "Thông tin tài khoản",
  });
};