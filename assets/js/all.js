"use strict";

// 請代入自己的網址路徑
var api_path = "joycheng";
var token = "PSNly2pd99XQct8dnO9toWyVyO13";
var productData = [];
var cartData = [];
var cartProductId = '';

function init() {
  if (document.querySelector('[data-page="front"]')) {
    getProductList();
    getCartList();
  } else {}
}

init(); //font 
//取得產品列表

function getProductList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products")).then(function (response) {
    productData = response.data.products;
    renderProductList(productData);
    var selectList = document.querySelector('.js-select');
    selectList.addEventListener('change', renderSelectList);
    var addCartBtn = document.querySelectorAll('.js-addToCart');
    addCartBtn.forEach(function (item) {
      return item.addEventListener('click', addToCartData);
    });
  })["catch"](function (error) {
    console.log('error', error);
  });
} //renderProductList


function renderProductList(inputData) {
  var productList = document.querySelector('.js-product-list');
  var str = '';
  inputData.forEach(function (item) {
    var content = "\n    <li class=\"productCard d-flex flex-column justify-content-between\" data-id=\"".concat(item.id, "\" data-category=\"").concat(item.category, "\">\n    <div>\n      <h4 class=\"productType\">\u65B0\u54C1</h4>\n      <img src=\"").concat(item.images, "\" alt=\"product img\">\n      <a href=\"#\" class=\"addCardBtn js-addToCart\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n      <h3>").concat(item.title, "</h3>\n    </div>\n      <div class=\"\">\n        <del class=\"originPrice\">NT$").concat(addCommaReg(item['origin_price']), "</del>\n        <p class=\"nowPrice\">NT$").concat(addCommaReg(item.price), "</p>\n      </div>\n    </li>\n    ");
    str += content;
  });
  productList.innerHTML = str;
} // 加上千分位


function addCommaReg(num) {
  var number = num.toString().split('.');
  number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return number.join('.');
} //select change add render


function renderSelectList(e) {
  console.log(e.target.value);
  var filterData = []; //productData

  if (e.target.value === '全部') {
    filterData = productData;
  } else {
    filterData = productData.filter(function (item) {
      return item.category === e.target.value;
    });
  }

  renderProductList(filterData);
} //加入購物車


function addCartItem(productId) {
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
    data: {
      "productId": productId,
      "quantity": 1
    }
  }).then(function (response) {
    console.log(response.data.cart);
    getCartList();
  });
} //取得購物車清單


function getCartList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    cartData = response.data.carts;
    renderCartList(cartData);
  });
} //點擊監聽事件


function addToCartData(e) {
  e.preventDefault();
  var productId = e.target.closest('li').dataset.id;
  addCartItem(productId);
} // render cartList


function renderCartList(inputData) {
  var cartList = document.querySelector('.js-cartList');
  var str = '';
  inputData.forEach(function (item) {
    var content = "\n    <tr>\n    <td>\n        <div class=\"cardItem-title\">\n            <img src=\"".concat(item.product.images, "\" alt=\"img\">\n            <p>").concat(item.product.title, "</p>\n        </div>\n    </td>\n    <td>NT$").concat(addCommaReg(item.product.price), "</td>\n    <td>1</td>\n    <td>NT$").concat(addCommaReg(item.product['origin_price']), "</td>\n    <td class=\"discardBtn\">\n        <a href=\"#\" class=\"material-icons\">\n            clear\n        </a>\n    </td>\n  </tr>\n  ");
    str += content;
  });
  cartList.innerHTML = str;
} // C3.js


var chart = c3.generate({
  bindto: '#chart',
  // HTML 元素綁定
  data: {
    type: "pie",
    columns: [['Louvre 雙人床架', 1], ['Antony 雙人床架', 2], ['Anty 雙人床架', 3], ['其他', 4]],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      "其他": "#301E5F"
    }
  }
});
//# sourceMappingURL=all.js.map
