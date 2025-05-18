const ProductCategory = require("../../models/product-category.model.js");
const systemConfig = require("../../config/system.js");

const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const createTreeHelper = require("../../helpers/createTree.js");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  //Filter
  // const filterStatus = filterStatusHelper(req.query);
  // End Filter
  let find = {
    deleted: false,
  };

  // Sử dụng params trên url thì if mới thực hiện
  // if (req.query.status) {
  //   find.status = req.query.status;
  // }

  // //Search
  // const objectSearch = searchHelper(req.query);
  // if (objectSearch.regex) {
  //   find.title = objectSearch.regex;
  // }
  // End Search

  //Pagination
  // const count = await ProductCategory.countDocuments(find);
  // let objectPagination = paginationHelper(
  //   {
  //     currentPage: 1,
  //     limitItems: 4,
  //   },
  //   req.query,
  //   count
  // );
  // End Pagination

  // Sort
  // let sort = {};

  // if (req.query.sortKey && req.query.sortValue) {
  //   sort[req.query.sortKey] = req.query.sortValue;
  // } else {
  //   sort.position = "desc";
  // }
  // End Sort

  const records = await ProductCategory.find(find);
  // .sort(sort)
  // .limit(objectPagination.limitItems)
  // .skip(objectPagination.skip);
  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    // filterStatus: filterStatus,
    // keyword: objectSearch.keyword,
    // pagination: objectPagination,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Tạo danh mục mới
  const records = new ProductCategory(req.body);
  await records.save();
  req.flash("success", "Thêm danh mục sản phẩm thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    const records = await ProductCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  // Update category
  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }

  res.redirect(req.get("Referrer") || "/");
};
