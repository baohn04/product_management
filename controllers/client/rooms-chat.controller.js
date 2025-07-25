const User = require("../../models/user.model.js");
const RoomChat = require("../../models/room-chat.model.js");

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false,
  });

  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id
    }).select("fullName avatar");

    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create.pug", {
    pageTitle: "Tạo phòng",
    friendList: friendList
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.userId;

  console.log(usersId);

  const dataRoomChat = {
    title: title,
    typeRoom: "group",
    users: []
  };

  usersId.forEach(item => {
    dataRoomChat.users.push({
      user_id: item,
      role: "user"
    });
  });

  // Info người tạo room chat
  dataRoomChat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"
  });

  const room = new RoomChat(dataRoomChat);
  await room.save();

  res.redirect(`/chat/${room.id}`);
};