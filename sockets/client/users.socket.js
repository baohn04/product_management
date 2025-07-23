const User = require("../../models/user.model.js");
const RoomChat = require("../../models/room-chat.model.js");

module.exports = async (res) => {
  _io.once('connection', (socket) => {
    // Người dùng gửi yêu cầu kết bạn 
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Thêm id của A vào acceptFriends của B
      const existAcceptUser = await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if(!existAcceptUser) {
        await User.updateOne({
          _id: userId
        }, {
          $push: { acceptFriends: myUserId }
        });
      }

      // Thêm id của B vào requestFriends của A
      const existRequestUser = await User.findOne({
        _id: myUserId,
        requestFriends: userId
      });

      if(!existRequestUser) {
        await User.updateOne({
          _id: myUserId
        }, {
          $push: { requestFriends: userId }
        });
      }

      // Lấy độ dài acceptFriends của B và hiển thị cho client B
      const infoUserB = await User.findOne({
        _id: userId
      });

      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
      });

      // Lấy thông tin của A để hiển thị cho client B
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id avatar fullName");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIENDS", {
        userId: userId,
        infoUserA: infoUserA
      });
    });

    // Người dùng hủy yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Xóa id của A trong acceptFriends của B
      const existAcceptUser = await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if(existAcceptUser) {
        await User.updateOne({
          _id: userId
        }, {
          $pull: { acceptFriends: myUserId }
        });
      }

      // Xóa id của B trong requestFriends của A
      const existRequestUser = await User.findOne({
        _id: myUserId,
        requestFriends: userId
      });

      if(existRequestUser) {
        await User.updateOne({
          _id: myUserId
        }, {
          $pull: { requestFriends: userId }
        });
      }

      // Lấy độ dài acceptFriends của B và hiển thị cho client B
      const infoUserB = await User.findOne({
        _id: userId
      });

      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
      });

      // Lấy userId của A trả về cho B
      const infoUserA = await User.findOne({
        _id: myUserId
      }).select("id avatar fullName");

      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", {
        userId: userId,
        infoUserA: infoUserA
      });
    });

    // Người dùng từ chối kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Xóa id của A trong acceptFriends của B
      const existAcceptUser = await User.findOne({
        _id: myUserId,
        acceptFriends: userId
      });

      if(existAcceptUser) {
        await User.updateOne({
          _id: myUserId
        }, {
          $pull: { acceptFriends: userId }
        });
      }

      // Xóa id của B trong requestFriends của A
      const existRequestUser = await User.findOne({
        _id: userId,
        requestFriends: myUserId
      });

      if(existRequestUser) {
        await User.updateOne({
          _id: userId
        }, {
          $pull: { requestFriends: myUserId }
        });
      }
    });

    // Người dùng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      
      // Lấy ra user đã tồn tại
      const existAcceptUser = await User.findOne({
        _id: myUserId,
        acceptFriends: userId
      });
      const existRequestUser = await User.findOne({
        _id: userId,
        requestFriends: myUserId
      });

      // Tạo room chat
      let roomChat;
      if(existAcceptUser && existRequestUser) {
        roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              user_id: userId,
              role: "superAdmin"
            },
            {
              user_id: myUserId,
              role: "superAdmin"
            }
          ]
        });

        await roomChat.save();
      }

      // Xóa id của A trong acceptFriends của B AND Thêm {user_id, room_chat_id} của A vào friendList của B
      if(existAcceptUser) {
        await User.updateOne({
          _id: myUserId
        }, {
          $push: { 
            friendList: {
              user_id: userId,
              room_chat_id: roomChat.id
            }
           },
          $pull: { acceptFriends: userId }
        });
      }

      // Xóa id của B trong requestFriends của A AND Thêm {user_id, room_chat_id} của B vào friendList của A
      if(existRequestUser) {
        await User.updateOne({
          _id: userId
        }, {
          $push: { 
            friendList: {
              user_id: myUserId,
              room_chat_id: roomChat.id
            }
           },
          $pull: { requestFriends: myUserId }
        });
      }
    });
  });
}