const User = require("../../models/user.model.js");
const Role = require("../../models/role.model.js");
const systemConfig = require("../../config/system.js");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({
      token: req.cookies.tokenUser,
    });

    if (!user) {
      res.redirect(`/user/login`);
    }
  }
  next();
};
