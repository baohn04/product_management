const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // SocketIO
  _io.once('connection', (socket) => { // once: chỉ kết nối user 1 lần duy nhất (không cần phải kết nối lại khi load lại trang)
    socket.on("CLIENT_SEND_MASSAGE", async (content) => {
      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: content
      });
      await chat.save();

      // Trả data về cho client
      _io.emit("SERVER_RETURN_MASSAGE", {
        userId: userId,
        fullName: fullName,
        content: content
      });
    });
  });
  // END SocketIO

  // Lấy ra data
  const chats = await Chat.find({
    deleted: false
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName");

    chat.infoUser = infoUser;
  }

  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
    chats: chats
  });
};