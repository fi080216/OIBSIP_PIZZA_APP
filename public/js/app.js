import axios from "axios";

function updateCart(pizza) {
  axios.post("/update-cart", pizza).then((res) => {
    cartCounter.innerText = res.data.totalQty;
  });
}

let proceed = document.querySelectorAll('.proceed');
// console.log("hi")
let cartCounter = document.querySelector('#cartCounter');

proceed.forEach((button) => {
  btn.addEventListener('click', (e) => {
  
    let pizza = JSON.parse(btn.dataset.pizza)
    updateCart(pizza)
    console.log(e)
  })
    
    
  })

 



