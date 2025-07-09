const User = require("../../models/user.model.js");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    return res.redirect(`/user/login`);
  }

  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  });

  if (!user) {
    return res.redirect(`/user/login`);
  }

  next();
};
