
let proceed = document.querySelectorAll(".proceed");
let cartCounter = document.querySelector("#cartCounter");



function updateCart(pizza) {
  axios.post("/update-cart", pizza).then((res) => {
    cartCounter.innerText = res.data.totalQty;
  });
}

proceed.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

const alertMsg = document.getElementById("success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ?  hiddenInput.value: null

order = JSON.parse(order)



function updateStatus(order){
  statuses.forEach((status)=>{
    status.classList.remove('step-completed')
    status.classList.remove('current')
  })
 let  stepCompleted = true;
 statuses.forEach((status)=>{
   let dataProp = status.dataset.status
   if(stepCompleted){
    status.classList.add('step-completed')
   }
   if(dataProp === order.status){
    stepCompleted = false
    if(status.nextElementSibling){
    status.nextElementSibling.classList.add('current')
    }
   }

 })

}
updateStatus(order);


let socket = io()


if(order){
socket.emit('join', `order_${order._id}`)
}

let adminArea = window.location.pathname

if(adminArea.includes('adminOrder')){
  
  socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data)=>{
  const updatedOrder = { ...order }
  // updatedOrder.updatedAt = moment().format()
  updatedOrder.status = data.status
  updateStatus(updatedOrder)
  console.log(data)
  
})