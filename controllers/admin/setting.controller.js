const SettingGeneral = require("../../models/setting-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({}); // Lấy ra bảng ghi đầu tiên vì collection settings-general chỉ có 1 bảng ghi duy nhất

  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({}); // Lấy ra bảng ghi đầu tiên vì collection settings-general chỉ có 1 bảng ghi duy nhất

  if(settingGeneral) {
    await SettingGeneral.updateOne({
      _id: settingGeneral.id
    }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  req.flash("success", "Cập nhật thành công");
  res.redirect(req.get("Referrer") || "/");
};