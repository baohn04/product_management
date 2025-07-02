const User = require("../../models/user.model.js");

module.exports.infoUser = async (req, res, next) => {
  if(req.cookies.tokenUser) {
    const user = User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false
    }).select("-password");

     if(user) {
      res.locals.user = user;
    }
  }

  next();
}