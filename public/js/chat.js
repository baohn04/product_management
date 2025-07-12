import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

// FileUpLoadWithPreview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
  multiple: true,
  maxFileCount: 6
});
// End FileUpLoadWithPreview

// CLIENT_SEND_MASSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray || [];

    if (content || images.length > 0) {
      // Gửi content hoặc ảnh lên server
      socket.emit("CLIENT_SEND_MASSAGE", {
        content: content,
        images: images
      });
      e.target.elements.content.value = ""; // Reset tin nhắn thành rỗng sau khi gửi
      upload.resetPreviewPanel(); // Clear image sau khi submit
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// End CLIENT_SEND_MASSAGE

// SERVER_RETURN_MASSAGE
socket.on("SERVER_RETURN_MASSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".inner-list-typing");

  const div = document.createElement("div");

  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  if(data.content) {
    htmlContent = `
      <div class="inner-content">${data.content}</div>
    `;
  }

  if(data.images) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `
        <img src="${image}">
      `;
    }
    
    htmlFullName += `
      <img src="">
    `;
        
    htmlImages += `</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;

  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
  
  // preview image
  const boxImages = div.querySelector(".inner-images");
  if(boxImages) {
    const gallery = new Viewer(boxImages);
  }
});
// End SERVER_RETURN_MASSAGE

// Scroll Chat to Bottom
const bodyChat = document.querySelector(".chat .inner-body");

if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight; // scroll cách top bằng chiều cao của scroll bodyChat
}
// End Scroll Chat to Bottom

// Show Typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
// End Show Typing

// Emoji picker

// Show popup icon box
const buttonIcon = document.querySelector(".chat .inner-foot .button-icon");
if(buttonIcon) {
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown');
  }
}

// Insert icon to input

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    // fix bị lỗi mất range khi chèn icon khi text dài 
    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();

    showTyping();
  });

  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
}
// End Emoji picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if(elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if(data.type == "show") {
      const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if(!existTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots"> 
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;

        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if(boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}
// End SERVER_RETURN_TYPING

// Preview Chat Images
const chatBody = document.querySelector(".chat .inner-body");
if(chatBody) {
  const gallery = new Viewer(chatBody);
}
// End Preview Chat Images