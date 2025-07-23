// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// End Chức năng gửi yêu cầu

// Chức năng hủy kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// End Chức năng hủy kết bạn

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// End Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accept");
      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
// End Chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
  const badgeUserAccept = document.querySelector("[badge-user-accept]");
  const userId = badgeUserAccept.getAttribute("badge-user-accept");
  if(userId == data.userId) {
    badgeUserAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIENDS

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {
  // Trang lời mời kết bạn
  const dataUsersAccept = document.querySelector("[data-users-accept]");
  if(dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if(userId == data.userId) {
      // Vẽ user ra giao diện real-time
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUserA._id);
      newBoxUser.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="${data.infoUserA.avatar ? data.infoUserA.avatar : '/images/avatar.jpg'}" alt=${data.infoUserA.fullName}>
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoUserA._id}">
                Chấp nhận
              </button>
              <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.infoUserA._id}">
                Từ chối
              </button>
              <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="disabled">
                Đã xóa
              </button>
              <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="disabled">
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `;

      dataUsersAccept.appendChild(newBoxUser);
      // End Vẽ user ra giao diện

      // Từ chối kết bạn real-time
      const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
      btnRefuseFriend.addEventListener("click", () => {
        btnRefuseFriend.closest(".box-user").classList.add("refuse");
        const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_REFUSE_FRIEND", userId);
      });
      // End Từ chối kết bạn real-time

      // Chấp nhận kết bạn real-time
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
      btnAcceptFriend.addEventListener("click", () => {
        btnAcceptFriend.closest(".box-user").classList.add("accept");
        const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      });
      // End Chấp nhận kết bạn real-time
    }
  }
  // End Trang lời mời kết bạn

  // Trang danh sách người dùng
  const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
  if(dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
    if(userId == data.userId) {
      // Xóa A khỏi danh sách trang người dùng của B
      const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
      if(boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove);
      }
    }
  }
  // End Trang danh sách người dùng
});
// End SERVER_RETURN_INFO_ACCEPT_FRIENDS

// SERVER_RETURN_USER_ID_CANCEL_FRIENDS
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", (data) => {
  // Trang lời mời kết bạn
  const dataUsersAccept = document.querySelector("[data-users-accept]");
  if(dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if(userId == data.userId) {
      // Xóa A khỏi danh sách lời mời kết bạn của B
      const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.infoUserA._id}"]`);
      if(boxUserRemove) {
        dataUsersAccept.removeChild(boxUserRemove);
      }
    }
  }
  // End Trang lời mời kết bạn

  // Trang danh sách người dùng
  const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
  if(dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
    if(userId == data.userId) {
      // Vẽ user ra giao diện real-time
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUserA._id);
      newBoxUser.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="${data.infoUserA.avatar ? data.infoUserA.avatar : '/images/avatar.jpg'}" alt=${data.infoUserA.fullName}>
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoUserA._id}">
                Chấp nhận
              </button>
              <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.infoUserA._id}">
                Từ chối
              </button>
              <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="disabled">
                Đã xóa
              </button>
              <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="disabled">
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `;

      dataUsersNotFriend.appendChild(newBoxUser);
      // End Vẽ user ra giao diện
    }
  }
  // End Trang danh sách người dùng
});
// End SERVER_RETURN_USER_ID_CANCEL_FRIENDS

// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if(dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
    if(boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", "online");
    }
  }
});
// End SERVER_RETURN_USER_ONLINE

// SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if(dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
    if(boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", "offline");
    }
  }
});
// End SERVER_RETURN_USER_OFFLINE