"use strict";

// 請代入自己的網址路徑
var api_path = "joycheng";
var token = "PSNly2pd99XQct8dnO9toWyVyO13";
var productData = [];
var cartData = [];
var cartProductId = '';
var cartId = '';
var orderData = [];

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
    var cartList = document.querySelector('.js-cartList');
    cartList.addEventListener('click', deleteCartId);
    var formList = document.querySelector('.js-form');
    formList.addEventListener('submit', getOrderData);
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
  var num = 0;
  var str = "<tr>\n  <th width=\"40%\">\u54C1\u9805</th>\n  <th width=\"15%\">\u55AE\u50F9</th>\n  <th width=\"15%\">\u6578\u91CF</th>\n  <th width=\"15%\">\u91D1\u984D</th>\n  <th width=\"15%\"></th>\n</tr>\n";

  if (inputData.length === 0) {
    var content = "\n  <tr>\n    <td colspan=\"2\" class=\"mx-auto\" >\n      \u8CFC\u7269\u8ECA\u76EE\u524D\u662F\u7A7A\u7684\u5466\uFF5E\n    </td>\n  </tr>\n  ";
    str += content;
  } else {
    inputData.forEach(function (item) {
      var content = "\n    <tr data-cart-id=\"".concat(item.id, "\">\n    <td>\n        <div class=\"cardItem-title\">\n            <img src=\"").concat(item.product.images, "\" alt=\"img\">\n            <p>").concat(item.product.title, "</p>\n        </div>\n    </td>\n    <td>NT$").concat(addCommaReg(item.product.price), "</td>\n    <td>1</td>\n    <td>NT$").concat(addCommaReg(item.product['origin_price']), "</td>\n    <td class=\"discardBtn\">\n        <a href=\"#\" class=\"material-icons\" data-clear=\"single\">\n            clear\n        </a>\n    </td>\n  </tr>\n  ");
      num += item.product.price;
      str += content;
    });
    var endContent = "  <tr>\n  <td>\n      <a href=\"#\" class=\"discardAllBtn\" data-clear=\"all\">\u522A\u9664\u6240\u6709\u54C1\u9805</a>\n  </td>\n  <td></td>\n  <td></td>\n  <td>\n      <p>\u7E3D\u91D1\u984D</p>\n  </td>\n  <td>NT$".concat(addCommaReg(num), "</td>\n</tr>");
    str += endContent;
  }

  cartList.innerHTML = str;
} // 刪除 cart id


function deleteCartId(e) {
  if (document.querySelector('.js-cartList')) {
    console.log(e.target.dataset.clear); // if(e.target.nodeList)

    if (e.target.dataset.clear === 'single') {
      e.preventDefault();
      cartId = e.target.closest('tr').dataset.cartId;
      deleteCartItem(cartId);
    } else if (e.target.dataset.clear === 'all') {
      e.preventDefault();
      deleteAllCartList();
    }

    ;
  }
} // 刪除購物車內特定產品


function deleteCartItem(cartId) {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/").concat(cartId)).then(function (response) {
    cartData = response.data.carts;
    getCartList();
  });
} //刪除所有產品


function deleteAllCartList() {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    cartData = response.data.carts;
    getCartList();
  });
} //送出表單


function getOrderData(e) {
  if (e.target.classList.contains('js-form')) {
    var inputGroup = document.querySelectorAll('input');
    var select = document.querySelector('#tradeWay');

    if (cartData.length === 0) {
      alert('購物車沒有東西呦～趕快去購物吧！');
      return;
    }

    for (var i = 0; i < inputGroup.length; i++) {
      if (inputGroup[i].getAttribute('type') !== 'submit') {
        if (inputGroup[i].value.length === 0) {
          alert("".concat(inputGroup[i].placeholder, "!"));
          return;
        } else {
          if (i + 2 != inputGroup.length) {
            orderData.push(inputGroup[i].value.trim());
          } else {
            orderData.push(inputGroup[i].value.trim());
            orderData.push(select.value);
            createOrder(orderData);
          }
        }
      }
    }
  }
}

function createOrder(orderData) {
  var userData = {
    "name": orderData[0].toString(),
    "tel": orderData[1].toString(),
    "email": orderData[2].toString(),
    "address": orderData[3].toString(),
    "payment": orderData[4].toString()
  };
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/orders"), {
    "data": {
      "user": {
        "name": "六角學院",
        "tel": "07-5313506",
        "email": "hexschool@hexschool.com",
        "address": "高雄市六角學院路",
        "payment": "Apple Pay"
      }
    }
  }).then(function (response) {
    console.log('success');
    console.log(response.data);
  })["catch"](function (error) {
    console.log(error);
  });
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
