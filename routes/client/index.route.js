const categoryMiddleware = require("../../middlewares/client/category.middleware.js");
const cartMiddleware = require("../../middlewares/client/cart.middleware.js");
const userMiddleware = require("../../middlewares/client/user.middleware.js");
const settingMiddleware = require("../../middlewares/client/setting.middleware.js");
const authMiddleware = require("../../middlewares/client/auth.middleware.js");

const productRoutes = require("./product.route.js");
const homeRoutes = require("./home.route.js");
const searchRoutes = require("./search.route.js");
const cartRoutes = require("./cart.route.js");
const checkoutRoutes = require("./checkout.route.js");
const userRoutes = require("./user.route.js");
const chatRoutes = require("./chat.route.js");
const usersRoutes = require("./users.route.js");
const roomsChatRoutes = require("./rooms-chat.route.js");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.settingGeneral);
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
  app.use("/chat", authMiddleware.requireAuth, chatRoutes);
  app.use("/users", authMiddleware.requireAuth, usersRoutes);
  app.use("/rooms-chat", authMiddleware.requireAuth, roomsChatRoutes);
};
