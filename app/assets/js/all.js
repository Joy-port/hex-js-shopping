// 請代入自己的網址路徑
const api_path = "joycheng";
const token = "PSNly2pd99XQct8dnO9toWyVyO13";

let productData =[];
let cartData= [];
let cartProductId = '';

function init(){
  if(document.querySelector('[data-page="front"]')){
    getProductList();
    getCartList();
  }else{

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
      console.log(response.data.cart);
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

  let str = '';
  inputData.forEach(item =>{
    let content = `
    <tr>
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
        <a href="#" class="material-icons">
            clear
        </a>
    </td>
  </tr>
  `;

    str += content;
  })
  cartList.innerHTML = str;
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
 
