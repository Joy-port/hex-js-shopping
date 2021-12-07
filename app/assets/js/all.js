// 請代入自己的網址路徑
const api_path = "joycheng";
const token = "PSNly2pd99XQct8dnO9toWyVyO13";

let productData =[];
let cartData= [];
let cartProductId = '';
let cartId = '';
let orderData= [];
let orderList=[];

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
      <a href="#" class="addCardBtn js-addToCart">加入購物車</a>
      <h3>${item.title}</h3>
    </div>
      <div class="">
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

//加入購物車
function addCartItem(productId) {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      "productId": productId,
      "quantity": 1
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
  let productId = e.target.closest('li').dataset.id;

  addCartItem(productId);

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
    <td>1</td>
    <td>NT$${addCommaReg(item.product['origin_price'])}</td>
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
            createOrder(orderData) ;
          }
        }
      }
    }
   
  }
}

function createOrder(orderData) {
  let userData = {
    "name": orderData[0].toString(),
    "tel": orderData[1].toString(),
    "email": orderData[2].toString(),
    "address": orderData[3].toString(),
    "payment": orderData[4].toString()
  };
  
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": orderData[0].toString(),
          "tel": orderData[1].toString(),
          "email": orderData[2].toString(),
          "address": orderData[3].toString(),
          "payment": orderData[4].toString()
        }
      }
    }
  ).then(function (response) {
      console.log('success');
      console.log(response.data);
    })
    .catch(function(error){
      console.log(error);
    })
}

// C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
      ],
      colors:{
          "Louvre 雙人床架":"#DACBFF",
          "Antony 雙人床架":"#9D7FEA",
          "Anty 雙人床架": "#5434A7",
          "其他": "#301E5F",
      }
  },
});

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
      console.log(orderList);
      renderOrderList(orderList);
    })
}

function renderOrderList(orderList){
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
  orderList.forEach(item =>{
    item.products.forEach(productItem =>{
      let productName = `
      <p>${productItem.title}</p>
      `;
      let nameStr ='';
      nameStr += productName;

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
            ${nameStr}
        </td>
        <td>2021/03/08</td>
        <td class="orderStatus">
            <a href="#">未處理</a>
        </td>
        <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除">
        </td>
      </tr>
      `
      str += content;
    })
  })

  orderTable.innerHTML = str;
  dateReg()
}

function dateReg(){
  let date = new Date(1638848349).getFullYear;
  console.log(date);
}