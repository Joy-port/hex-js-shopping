"use strict";

// 請代入自己的網址路徑
var api_path = "joycheng";
var token = "PSNly2pd99XQct8dnO9toWyVyO13";
var productData = [];
var cartData = [];
var cartProductId = '';
var cartId = '';
var orderData = [];
var orderList = [];

function init() {
  if (document.querySelector('[data-page="front"]')) {
    getProductList();
    getCartList();
  } else {
    getOrderList();
  }
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
    e.preventDefault();
    var inputGroup = document.querySelectorAll('input');
    var select = document.querySelector('#tradeWay');

    if (cartData.length === 0) {
      alert('購物車沒有東西呦～趕快去購物吧！');
      return;
    }

    var year = new Date().getFullYear();
    var month = (new Date().getMonth() + 1 < 10 ? '0' : '') + (new Date().getMonth() + 1); //十位數＋個位數

    var date = (new Date().getDate() < 10 ? '0' : '') + new Date().getDate();
    var dateValue = "".concat(year, "/").concat(month, "/").concat(date);

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
            orderData.push(dateValue);
            var userData = {
              "name": orderData[0],
              "tel": orderData[1],
              "email": orderData[2],
              "address": orderData[3],
              "payment": orderData[4]
            };
            console.log(userData);
            createOrder(userData);
          }
        }
      }
    }
  }
}

function createOrder(userData) {
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/orders"), {
    "data": {
      "user": userData
    }
  }).then(function (response) {
    alert('訂單已送出囉～');
    var inputGroup = document.querySelectorAll('input');
    var select = document.querySelector('#tradeWay');
    inputGroup.forEach(function (item) {
      if (item.getAttribute('type') !== 'submit') {
        item.value = '';
      }
    });
    select.value = 'ATM';
    getCartList();
  })["catch"](function (error) {
    console.log('error', error.response.data.message);
  });
} //back


function getOrderList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    orderList = response.data.orders;
    renderOrderList(orderList);
    getChartData(orderList);
    var deleteAll = document.querySelectorAll('[data-del]');
    deleteAll.forEach(function (item) {
      return item.addEventListener('click', deleteOrders);
    });
    getOrderStatus();
  });
}

function renderOrderList(inputData) {
  var orderTable = document.querySelector('.js-order-list');
  var str = '';
  str += " <thead>\n  <tr>\n      <th>\u8A02\u55AE\u7DE8\u865F</th>\n      <th>\u806F\u7D61\u4EBA</th>\n      <th>\u806F\u7D61\u5730\u5740</th>\n      <th>\u96FB\u5B50\u90F5\u4EF6</th>\n      <th>\u8A02\u55AE\u54C1\u9805</th>\n      <th>\u8A02\u55AE\u65E5\u671F</th>\n      <th>\u8A02\u55AE\u72C0\u614B</th>\n      <th>\u64CD\u4F5C</th>\n  </tr>\n</thead>";

  if (inputData.length === 0) {
    var content = "\n    <tr>\n      <td colspan=\"9\">\u76EE\u524D\u6C92\u6709\u8A02\u55AE\u5466\uFF5E</td>\n    </tr>\n    ";
    str += content;
  } else {
    orderList = sortOrderList(inputData);
    orderList.forEach(function (item) {
      item.products.forEach(function (productItem) {
        var content = "\n        <tr  data-id=\"".concat(item.id, "\">\n          <td>").concat(item.createdAt, "</td>\n          <td>\n              <p>").concat(item.user.name, "</p>\n              <p>").concat(item.user.tel, "</p>\n          </td>\n          <td>").concat(item.user.address, "</td>\n          <td>").concat(item.user.email, "</td>\n          <td>\n            <p>").concat(productItem.title, "</p>\n          </td>\n          <td>").concat(dateReg(item.createdAt), "</td>\n          <td class=\"orderStatus\">\n              <a href=\"#\" class=\"js-status\" data-status=\"").concat(item.paid ? 'true' : 'false', "\">").concat(item.paid ? '已處理' : '未處理', "</a>\n          </td>\n          <td>\n              <input type=\"button\" class=\"delSingleOrder-Btn\" value=\"\u522A\u9664\" data-del=\"single\">\n          </td>\n        </tr>\n        ");
        str += content;
      });
    });
  }

  orderTable.innerHTML = str;
} //訂單日期


function dateReg(inputDate) {
  var date = new Date(inputDate * 1000);
  return date.toLocaleDateString();
}

function sortOrderList(inputData) {
  inputData.sort(function (a, b) {
    return a.createdAt - b.createdAt;
  });
  return inputData;
}

function deleteOrders(e) {
  if (e.target.dataset.del) {
    e.preventDefault();

    if (e.target.dataset.del === 'all') {
      deleteAllOrder();
    } else if (e.target.dataset.del === 'single') {
      var id = e.target.closest('tr').dataset.id;
      deleteOrderItem(id);
    }
  }
} // 刪除全部訂單


function deleteAllOrder() {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    getOrderList();
  });
} // 刪除特定訂單


function deleteOrderItem(orderId) {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/").concat(orderId), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    getOrderList();
  });
} // 修改訂單狀態


function editOrderList(orderId, orderStatus) {
  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    "data": {
      "id": orderId,
      "paid": orderStatus
    }
  }, {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response);
    getOrderList();
  });
}

function getOrderStatus() {
  if (document.querySelector('.js-status')) {
    var statusBtn = document.querySelectorAll('.js-status');
    statusBtn.forEach(function (item) {
      item.addEventListener('click', editOrderStatus);
    });
  }
}

function editOrderStatus(e) {
  e.preventDefault();

  if (e.target.classList.contains('js-status')) {
    var orderId = e.target.closest('tr').dataset.id;
    var orderStatus = null;

    if (e.target.closest('a').dataset.status === 'true') {
      orderStatus = false;
    } else {
      orderStatus = true;
    }

    editOrderList(orderId, orderStatus);
  }
}

function getChartData(orderList) {
  console.log(orderList);
  var productObj = {};
  orderList.forEach(function (item) {
    item.products.forEach(function (productItem) {
      if (productObj[productItem.title]) {
        productObj[productItem.title] += parseInt(productItem.quantity);
      } else if (!productObj[productItem.title]) {
        productObj[productItem.title] = parseInt(productItem.quantity);
      }
    });
  });
  var aryObj = Object.keys(productObj);
  var chartData = [];
  aryObj.forEach(function (item) {
    var ary = [];
    ary.push(item);
    ary.push(productObj[item]);
    chartData.push(ary);
  });
  generateChart(chartData);
}

function generateChart(chartData) {
  // C3.js
  var chart = c3.generate({
    bindto: '#chart',
    // HTML 元素綁定
    data: {
      type: "pie",
      columns: chartData,
      colors: {
        "Louvre 雙人床架": "#DACBFF",
        "Antony 雙人床架": "#9D7FEA",
        "Anty 雙人床架": "#5434A7",
        "其他": "#301E5F"
      }
    }
  });
}
//# sourceMappingURL=all.js.map
