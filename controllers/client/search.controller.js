const Product = require("../../models/product.model.js");
const productHelper = require("../../helpers/product.js");

// [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];

  if(keyword) {
    const keywordRegex = new RegExp(keyword, "i"); //Tìm kiếm không phân biệt chữ hoa, chữ thường
    const products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false
    });

    newProducts = productHelper.priceNewProducts(products);
  }

  res.render("client/pages/search/index.pug", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts
  });
};