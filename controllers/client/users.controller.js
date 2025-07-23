const User = require("../../models/user.model.js");
const usersSocket = require("../../sockets/client/users.socket.js");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // Socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  const friendList = myUser.friendList;
  const friendListId = friendList.map(item => item.user_id);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } }, // $ne: (not equal) tìm tất cả các id ngoại trừ id là userId
      { _id: { $nin: requestFriends } }, // $nin: (not in) tìm tất cả các id ngoại trừ các id trong trường requestFriends của user
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendListId } },
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  // Socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends;

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  // Socket
  usersSocket(res);
  // end socket
  
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/accept.pug", {
    pageTitle: "Lời mời kết bạn",
    users: users
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  // Socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const friendList = myUser.friendList;
  const friendListId = friendList.map(item => item.user_id);

  const users = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false
  }).select("id avatar fullName statusOnline");

  users.forEach(user => {
    const infoUserInFriendList = friendList.find(item => item.user_id == user.id); 
    user.roomChatId = infoUserInFriendList.room_chat_id;
  });

  res.render("client/pages/users/friends.pug", {
    pageTitle: "Danh sách bạn bè",
    users: users
  });
};