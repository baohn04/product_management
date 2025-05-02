// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href); // hàm URL dùng để chỉnh sửa url tùy chọn

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status"); //lấy giá trị của attribute
      if (status) {
        url.searchParams.set("status", status); //đổi params của url theo biến status (..products?status=...)
      } else {
        url.searchParams.delete("status"); // nếu status null thì xóa params có tên status
      }
      window.location.href = url.href;
    });
  });
}
// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); //Ngăn chặn load lại trang web
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  let url = new URL(window.location.href);
  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
// End Pagination

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      //Đếm số lượng ô checkbox đã check vào
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (inputsId.length == countChecked) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// End Checkbox Multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn load lại trang khi submit
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    //Lấy ra các ô input đã check
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có muốn xóa những sản phẩm này?");
      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "change-position") {
          //Lấy ra value của thẻ input position dựa trên input đã check vào
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một bản ghi");
    }
  });
}
// End Form Change Multi

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => {
    console.log(e);
    const file = e.target.files[0]; // Lấy ra file ảnh đã upload
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Upload Image

// Delete Upload Image
const deleteImage = document.querySelector(".delete-image");
if(deleteImage) {
  deleteImage.addEventListener("click", () => {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    uploadImageInput.value="";
    uploadImagePreview.src="";
  })
}
// End Delete Upload Image
