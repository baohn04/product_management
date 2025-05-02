module.exports = (query) => {
  let objectSearch = {
    keyword: ""
  }

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const re = new RegExp(objectSearch.keyword, "i"); //regex, "i" là không phân biệt ký tụ hoa, thường
    objectSearch.regex = re;
  }

  return objectSearch;
}