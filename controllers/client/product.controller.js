const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");
const productHelper = require("../../helpers/product.js");
const productCategoryHelper = require("../../helpers/product-category.js");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);
  
  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts
  });
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false
  });

  // Hàm lấy ra các danh mục con
  const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id);

  const products = await Product.find({
    productCategoryId: { $in: [category.id, ...listSubCategoryId] },
    status: "active",
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: category.title,
    products: newProducts
  });
};

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active"
    };

    const product = await Product.findOne(find); // Chỉ tìm ra một bản ghi trong database

    if(product.productCategoryId) {
      const category = await ProductCategory.findOne({
        _id: product.productCategoryId,
        status: "active",
        deleted: false
      });

      product.category = category;
    }

    product.priceNew = productHelper.priceNewProduct(product);

    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    // Nên là trang 404 sẽ tốt hơn
    res.redirect(`/products`);
  }
}