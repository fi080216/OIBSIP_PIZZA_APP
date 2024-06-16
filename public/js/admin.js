import moment from 'moment'
import axios from 'axios'

function initAdmin(){

    const orderTableBody = document.querySelector('#orderTableBody')
let orders = []

let markup

axios.get('/customers/adminOrder', {
    headers: {
        "X-Requested-With": "XMLHttpREQUEST"
}
}).then(res =>{
    orders = res.data
    markup = generateMarkUp(orders)
    orderTableBody.innerHTML = markup 

}).catch(err =>{
    console.log(err)
})

function renderItems(items){
    let parsedItems = Object.values(items)
    return parsedItems.map((menuItem)=>{
        return `
        <p>${ menuItem.item.name} - ${menuItem.qty} pcs </p>
        `
    }).join('')
}





 function generateMarkUp(orders){

    return orders.map(order =>{
        return `
        <tr> 
        <td class="border px-4 py-2 text-green-900"> 
        <p>${order._id}</p>
        <div>${ renderItems(order.items)}</div>
        </td>
        <td class="border px-4 py-2">${order.customerId.name} </td>
        <td class="border px-4 py-2">${order.address} </td>

         <td class="border px-4 py-2">
         <div class="inline-block relative w-64">
         <form action="/admin/order/status" method="POST">
         <input type="hidden" name="orderId" value="${order._id}">
         <select name="status" onChange="this.form.submit()"
          class="block appearence-none w-full bg-white border
          border-gray-400 hove:border-gray-500 px-4 py-2 pr-8 rounded
          shadow leading-tight focus:outline-none focus:shadow-outline">
          <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>
          Placed</option>
          <option value="confirmed" ${order.status === 'confrimed' ?
            'selected' : ''}>
            Confrimed</option>
          <option value="prepared" ${order.status === 'prepared' ?
            'selected' : ''}>
            Prepared</option>
            <option value="delivered" ${order.status === 'delivered' ?
            'selected' : ''}>
            Delivered</option>
            <option value="completed" ${order.status === 'completed' ?
            'selected' : ''}>
            Completed</option>
            </select>
            </form>
            </div>
            </td>
            <td class="border px-4 py-2">
            ${moment(order.createdAt).format('hh:mm A')}
            </td>
            </tr>


          


         

        
        
        
        `
    }).join('')


 }
} 

module.exports = initAdmin