module.exports.registerPost = (req, res, next) => {
  if(!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.email) {
    req.flash("error", "Vui lòng nhập Email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(req.body.password != req.body.confirmPassword) {
    req.flash("error", "Mật khẩu không trùng khớp!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); // Chuyển sang đoạn mã kế tiếp
}

module.exports.loginPost = (req, res, next) => {
  if(!req.body.email) {
    req.flash("error", "Vui lòng nhập Email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); // Chuyển sang đoạn mã kế tiếp
}

module.exports.forgotPasswordPost = (req, res, next) => {
  if(!req.body.email) {
    req.flash("error", "Vui lòng nhập Email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); 
}

module.exports.resetPasswordPost = (req, res, next) => {
  if(!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.confirmPassword) {
    req.flash("error", "Vui lòng xác nhận mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(req.body.password != req.body.confirmPassword) {
    req.flash("error", "Mật khẩu không trùng khớp!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); 
}