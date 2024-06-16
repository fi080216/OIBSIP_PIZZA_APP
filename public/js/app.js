import {initAdmin} from './admin'

function updateCart(pizza) {
  axios.post("/update-cart", pizza).then((res) => {
    cartCounter.innerText = res.data.totalQty;
  })
}


let proceed = document.querySelectorAll('.proceed');
let cartCounter = document.querySelector('#cartCounter');



proceed.forEach((btn) => {
  
  btn.addEventListener('click', (e) => {
    
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
    
  });
});

const alertMsg = document.getElementById('#success-alert')
if(alertMsg){
  setTimeout(() => {
    alertMsg.remove()
  }, 2000)
}
initAdmin()
