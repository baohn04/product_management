const Product = require("../../models/product.model.js");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = products.map(item => {
    item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
    return item;
  });

  console.log(products);
  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    };

    const product = await Product.findOne(find); // Chỉ tìm ra một bản ghi trong database
    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    // Nên là trang 404 sẽ tốt hơn
    res.redirect(`/products`);
  }
}