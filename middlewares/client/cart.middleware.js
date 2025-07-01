const Cart = require("../../models/cart.model.js");

module.exports.cartId = async (req, res, next) => {
  if(!req.cookies.cartId) { // Nếu chưa từng thêm giỏ hàng
    const cart = new Cart();
    await cart.save();

    const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 year
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime) // set thời gian hết hạn của cookies
    }); // Lưu giỏ hàng trống
  } else {
    // Khi đã có giỏ hàng trước đó
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });

    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0); // Tính tổng số lượng của các sản phẩm trong cart
    res.locals.miniCart = cart;
  }
  next();
}