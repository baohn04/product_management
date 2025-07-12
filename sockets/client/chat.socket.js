const Chat = require("../../models/chat.model");
const uploadCloudinaryHelper = require("../../helpers/uploadCloudinary.js");

module.exports = async (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once('connection', (socket) => { // once: chỉ kết nối user 1 lần duy nhất (không cần phải kết nối lại khi load lại trang)
    socket.on("CLIENT_SEND_MASSAGE", async (data) => {
      let images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadCloudinaryHelper.uploadToCloudinary(imageBuffer);
        images.push(link);
      }
      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images
      });

      await chat.save();

      // Trả data về cho client
      _io.emit("SERVER_RETURN_MASSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      });
    });

    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      });
    });
  });
}