module.exports = (query) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];
  
  if (query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == query.status
    ); //Tìm index chứa các giá trị của mảng filterStatus
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == ""); //Tìm index chứa các giá trị của mảng filterStatus
    filterStatus[index].class = "active";
  }

  return filterStatus;
}