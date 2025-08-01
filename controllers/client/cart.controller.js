const Cart = require("../../models/cart.model.js");
const Product = require("../../models/product.model.js");
const productsHelper = require("../../helpers/product.js");

// [GET] /cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      });

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew; // Tính tổng tiền của từng sản phẩm
    }
  }

  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  ); // Tính tổng tiền của giỏ hàng

  res.render("client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({ _id: cartId });
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductInCart) {
    // Chỉ cập nhật quantity
    const newQuantity = existProductInCart.quantity + quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
  res.redirect(req.get("Referrer") || "/");
};

// [GET] /delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  // Xoá sản phẩm khỏi giỏ h
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );
  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
  res.redirect(req.get("Referrer") || "/");
};

// [GET] /update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  // Xoá sản phẩm khỏi giỏ h
  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );
  req.flash("success", "Đã cập nhật số lượng!");
  res.redirect(req.get("Referrer") || "/");
};
