const order = require("../../models/order");

function AdminOrderController(){
    return{
        async index(req,res, next){
           await order.find({status:{$ne: 'completed'} }, null, {sort: {
                'createdAt': -1
            }}).populate('customerId', '-password').exec((err, orders)=>{
               if(req.xhr){
                return res.json(orders)
               }else{
                res.render('customers/adminOrder')
               }
                
            })



        }
    }
}

module.exports = AdminOrderController;