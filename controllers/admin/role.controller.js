const Role = require("../../models/role.model.js");
const systemConfig = require("../../config/system.js");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);
  res.render("admin/pages/roles/index.pug", {
    pageTitle: "Trang nhóm quyền",
    records: records
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const records = new Role(req.body);
  await records.save();
  req.flash("success", "Thêm nhóm quyền thành công!");
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false
    }
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit.pug", {
      pageTitle: "Sửa nhóm quyền",
      data: data
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions.pug", {
    pageTitle: "Phân quyền",
    records: records
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for(const item of permissions) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
  }
  req.flash("success", "Cập nhật phân quyền thành công!");
  res.redirect(req.get("Referrer") || "/");
};