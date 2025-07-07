const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statictis = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  // Thong ke category
  statictis.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false
  });

  statictis.categoryProduct.active = await ProductCategory.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.categoryProduct.inactive = await ProductCategory.countDocuments({
    status: "inactive",
    deleted: false
  });

  // Thong ke product
  statictis.product.total = await Product.countDocuments({
    deleted: false
  });

  statictis.product.active = await Product.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.product.inactive = await Product.countDocuments({
    status: "inactive",
    deleted: false
  });

  // Thong ke account admin
  statictis.account.total = await Account.countDocuments({
    deleted: false
  });

  statictis.account.active = await Account.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.account.inactive = await Account.countDocuments({
    status: "inactive",
    deleted: false
  });

  // Thong ke account user
  statictis.user.total = await User.countDocuments({
    deleted: false
  });

  statictis.user.active = await User.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.user.inactive = await User.countDocuments({
    status: "inactive",
    deleted: false
  });
  
  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Tổng quan",
    statictis: statictis
  });
};