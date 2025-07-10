// CLIENT_SEND_MASSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;

    if (content) {
      socket.emit("CLIENT_SEND_MASSAGE", content);
      e.target.elements.content.value = ""; // Reset tin nhắn thành rỗng sau khi gửi
    }
  });
}
// End CLIENT_SEND_MASSAGE

// SERVER_RETURN_MASSAGE
socket.on("SERVER_RETURN_MASSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const chat = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");

  let htmlFullName = ``;

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});
// End SERVER_RETURN_MASSAGE

// Scroll Chat to Bottom
const bodyChat = document.querySelector(".chat .inner-body");

if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight; // scroll cách top bằng chiều cao của scroll bodyChat
}
// End Scroll Chat to Bottom