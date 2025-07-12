const uploadCloudinaryHelper = require("../../helpers/uploadCloudinary.js");

module.exports.upload = async (req, res, next) => {
  if (req.file) {
    const result = await uploadCloudinaryHelper.uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = result;
  }
  next();
}