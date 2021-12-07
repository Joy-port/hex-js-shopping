// 請代入自己的網址路徑
const api_path = "joycheng";
const token = "PSNly2pd99XQct8dnO9toWyVyO13";

let productData =[];
let cartData= [];
let cartProductId = '';
let cartId = '';
let orderData= [];
let orderList=[];
let cartNum = 1 ;

function init(){
  if(document.querySelector('[data-page="front"]')){
    getProductList();
    getCartList();
  }else{
    getOrderList();
    
  }
}

init();

//font 

//取得產品列表
function getProductList() {
  axios.get(
              `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
      )
    .then(function (response) {
      productData = response.data.products;
      renderProductList(productData);
      const selectList = document.querySelector('.js-select');
      selectList.addEventListener('change', renderSelectList);

      const addCartBtn = document.querySelectorAll('.js-addToCart');
      addCartBtn.forEach(item => item.addEventListener('click', addToCartData));

      const cartList = document.querySelector('.js-cartList');
      cartList.addEventListener('click', deleteCartId);

      const formList = document.querySelector('.js-form');
      formList.addEventListener('submit',getOrderData);

    })
    .catch(function(error){
      console.log('error', error)
    })
}

//renderProductList
function renderProductList(inputData){
  const productList = document.querySelector('.js-product-list');
  let str ='';
  inputData.forEach(item=>{
    const content = `
    <li class="productCard d-flex flex-column justify-content-between" data-id="${item.id}" data-category="${item.category}">
    <div>
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="product img">
      <a href="#" class="addCardBtn js-addToCart" data-num="1">加入購物車</a>
      <h3>${item.title}</h3>
    </div>
      <div>
        <del class="originPrice">NT$${addCommaReg(item['origin_price'])}</del>
        <p class="nowPrice">NT$${addCommaReg(item.price)}</p>
      </div>
    </li>
    `;
    str += content;
  });
  productList.innerHTML = str;
} 

// 加上千分位
function addCommaReg(num){
  var number = num.toString().split('.');
  number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return number.join('.')
}

//select change add render
function renderSelectList(e){
  console.log(e.target.value);
  let filterData = [];

  //productData
  if(e.target.value === '全部'){
    filterData = productData;
  }else{
    filterData = productData.filter((item => item.category === e.target.value))
  }
  renderProductList(filterData);

}

//加入購物車 1
function addCartItem(productId, num) {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      "productId": productId,
      "quantity": num
    }
  }).
    then(function (response) {
      getCartList();
  })
}

//取得購物車清單
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cartData = response.data.carts ;
      renderCartList(cartData);
    })
}

//點擊監聽事件
function addToCartData(e){
  e.preventDefault();
  if(e.target.closest('a').classList.contains('addCardBtn')){
    let productId = e.target.closest('li').dataset.id;
    let clickNum = e.target.closest('a').dataset.num;

    cartData.forEach(item =>{
      if(item.product.id === productId ){
        cartNum += parseInt(clickNum);
      }
    });

    addCartItem(productId, cartNum);
  }
  

}

// render cartList
function renderCartList(inputData){
  const cartList = document.querySelector('.js-cartList');
  let num = 0;
  let str = `<tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
  </tr>
  `;

  if(inputData.length ===0 ){
    let content = `
    <tr>
      <td colspan="2" class="mx-auto" >
        購物車目前是空的呦～
      </td>
    </tr>
    `;
    str += content;
    
  }else{
    console.log(inputData);
    inputData.forEach(item =>{
      let content = `
      <tr data-cart-id="${item.id}">
      <td>
          <div class="cardItem-title">
              <img src="${item.product.images}" alt="img">
              <p>${item.product.title}</p>
          </div>
      </td>
      <td>NT$${addCommaReg(item.product.price)}</td>
      <td>${item.quantity}</td>
      <td>NT$${addCommaReg(item.product.price*item.quantity)}</td>
      <td class="discardBtn">
          <a href="#" class="material-icons" data-clear="single">
              clear
          </a>
      </td>
    </tr>
    `;
      num += item.product.price;
      str += content;
    })
    let endContent = `  <tr>
    <td>
        <a href="#" class="discardAllBtn" data-clear="all">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
        <p>總金額</p>
    </td>
    <td>NT$${addCommaReg(num)}</td>
  </tr>`
    str += endContent ;
  }
  cartList.innerHTML =str;

}

// 刪除 cart id
function deleteCartId(e){
  if(document.querySelector('.js-cartList')){
    console.log(e.target.dataset.clear);

    // if(e.target.nodeList)
    if(e.target.dataset.clear === 'single'){
      e.preventDefault();
      cartId = e.target.closest('tr').dataset.cartId;

     deleteCartItem(cartId);
    }else if(e.target.dataset.clear === 'all'){
      e.preventDefault();
      deleteAllCartList();
    };

  }
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
    then(function (response) {
      cartData = response.data.carts ;
      getCartList()
    })
}

//刪除所有產品
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cartData = response.data.carts ;
      getCartList()
    })
}

//送出表單
function getOrderData(e){
  if(e.target.classList.contains('js-form')){
    e.preventDefault();
    const inputGroup = document.querySelectorAll('input');
    const select = document.querySelector('#tradeWay');
    if(cartData.length === 0){
      alert('購物車沒有東西呦～趕快去購物吧！')
      return;
    }

  const year = new Date().getFullYear() ;
  const month = (new Date().getMonth() + 1 < 10 ? '0' : '') + (new Date().getMonth() + 1) ;  //十位數＋個位數
  const date = (new Date().getDate() < 10 ? '0' : '') + new Date().getDate() ;
  let dateValue = `${year}/${month}/${date}`;


    for(let i = 0; i < inputGroup.length ; i++){
      if(inputGroup[i].getAttribute('type')!=='submit'){
        if(inputGroup[i].value.length === 0){
          alert( `${inputGroup[i].placeholder}!`);
          return;
        }else{
          if( i+2 != inputGroup.length){
            orderData.push(inputGroup[i].value.trim());
          }else{
            orderData.push(inputGroup[i].value.trim());
            orderData.push(select.value); 
            orderData.push(dateValue);

            let userData = {
              "name": orderData[0],
              "tel": orderData[1],
              "email": orderData[2],
              "address": orderData[3],
              "payment": orderData[4]
            };
            console.log(userData);
            createOrder(userData) ;
          }
        }
      }
    }
   
  }
}

function createOrder(userData) {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": userData
      }
    }
  ).
  then(function (response) {
      alert('訂單已送出囉～');
      const inputGroup = document.querySelectorAll('input');
      const select = document.querySelector('#tradeWay');

      inputGroup.forEach(item=>{
        if(item.getAttribute('type')!=='submit'){
          item.value ='';
        }
      })
      select.value = 'ATM';
      getCartList();

    })
    .catch(function(error){
      console.log('error',error.response.data.message);
    })
}

//back
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      orderList = response.data.orders;
      renderOrderList(orderList);
      getChartData(orderList)

      const deleteAll = document.querySelectorAll('[data-del]');
      deleteAll.forEach(item => item.addEventListener('click', deleteOrders));

      getOrderStatus();
    })
}

function renderOrderList(inputData){
  const orderTable = document.querySelector('.js-order-list');
  let str = '';
  str += ` <thead>
  <tr>
      <th>訂單編號</th>
      <th>聯絡人</th>
      <th>聯絡地址</th>
      <th>電子郵件</th>
      <th>訂單品項</th>
      <th>訂單日期</th>
      <th>訂單狀態</th>
      <th>操作</th>
  </tr>
</thead>`;
  if(inputData.length === 0){
    let content = `
    <tr>
      <td colspan="9">目前沒有訂單呦～</td>
    </tr>
    `
    str += content;
  }else{
    orderList = sortOrderList(inputData);
    orderList.forEach(item =>{
      item.products.forEach(productItem =>{
        let content = `
        <tr  data-id="${item.id}">
          <td>${item.createdAt}</td>
          <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
          </td>
          <td>${item.user.address}</td>
          <td>${item.user.email}</td>
          <td>
            <p>${productItem.title}</p>
          </td>
          <td>${dateReg(item.createdAt)}</td>
          <td class="orderStatus">
              <a href="#" class="js-status" data-status="${item.paid ? 'true':'false'}">${item.paid ? '已處理':'未處理'}</a>
          </td>
          <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除" data-del="single">
          </td>
        </tr>
        `
        str += content;
      })
    })
    
  }

  orderTable.innerHTML = str;
}

//訂單日期
function dateReg(inputDate){
  let date = new Date(inputDate*1000)
  return date.toLocaleDateString();
}


function sortOrderList(inputData){
  inputData.sort((a,b)=>{
    return a.createdAt - b.createdAt
  })
  return inputData
}

function deleteOrders(e){
  if(e.target.dataset.del){
    e.preventDefault()
    if(e.target.dataset.del==='all'){
      deleteAllOrder();
    }else if(e.target.dataset.del === 'single'){
      let id = e.target.closest('tr').dataset.id;
      deleteOrderItem(id);
    }
  }
}

// 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      getOrderList();
    })
}


// 刪除特定訂單
function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      getOrderList();
    })
}


// 修改訂單狀態

function editOrderList(orderId, orderStatus) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": orderStatus
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response);
      getOrderList();
    })
}


function getOrderStatus(){
  if(document.querySelector('.js-status')){
    const statusBtn = document.querySelectorAll('.js-status');
    statusBtn.forEach(item =>{
      item.addEventListener('click',editOrderStatus);
    })
  }
}

function editOrderStatus(e){
  e.preventDefault();
  if(e.target.classList.contains('js-status')){
    let orderId = e.target.closest('tr').dataset.id;
    let orderStatus = null;
    if(e.target.closest('a').dataset.status === 'true'){
       orderStatus = false;
    }else{
       orderStatus = true;
    }
    editOrderList(orderId,orderStatus);
  }
}

function getChartData(orderList){
  console.log(orderList);

  let productObj ={};
  orderList.forEach(item =>{
    item.products.forEach(productItem=>{
      if(productObj[productItem.title]){
          productObj[productItem.title] += parseInt(productItem.quantity);
      }else if(!productObj[productItem.title]){
        productObj[productItem.title]= parseInt(productItem.quantity);
      }
    })
  })

  let aryObj = Object.keys(productObj);
  let chartData = []

  aryObj.forEach(item =>{
    let ary =[];
    ary.push(item);
    ary.push(productObj[item]);
    chartData.push(ary);
  })

  generateChart(chartData);
}

function generateChart(chartData){
  // C3.js
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: chartData,
        colors:{
          "Louvre 雙人床架":"#DACBFF",
          "Antony 雙人床架":"#9D7FEA",
          "Anty 雙人床架": "#5434A7",
          "其他": "#301E5F",
        }
    },

  });

}

