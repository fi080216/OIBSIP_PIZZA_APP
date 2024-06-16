const Order = require('../../models/order');
const moment = require('moment')

function orderController() {
    return {
        store(req, res) {
            const { phone, address } = req.body;

            // Log the request body for debugging
            console.log('Request Body:', req.body);

            // Check if phone and address are provided
            if (!phone || !address) {
                req.flash('error', 'All fields are required');
                return res.redirect('/cart');
            }

            // Create a new order instance
            const order = new Order({
                customerId: req.user._id, // Ensure req.user._id is available
                items: req.session.cart.items, // Ensure req.session.cart.items contains the expected data
                phone,
                address,
                paymentType: 'COD', // Set default payment type if not provided
                status: 'order_placed' // Set default status if not provided
            });
        

            // Save the order to the database
            order
        .save()
        .then((order) => {
            req.flash("success", "Order placed successfully !")
            delete req.session.cart
          return res.redirect("/customer/orders");
        })
        .catch((err) => {
          req.flash("err", "Something went wrong !");
          return res.redirect('/cart')
        });
        },

         async index(req, res){
             const orders = await Order.find({
                customerId: req.user._id
            }, null, {sort: {'createdAt': -1}})
            res.render('customers/orders', {orders: orders, moment: moment})
            // console.log(orders)
        }
    };
}

module.exports = orderController;
