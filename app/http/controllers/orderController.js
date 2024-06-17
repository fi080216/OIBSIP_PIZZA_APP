const order = require('../../models/order');
const Order = require('../../models/order');
const moment = require('moment')

function orderController() {
    return {
        store(req, res) {
            const { phone, address } = req.body;

            

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

            const eventEmitter = req.app.get("eventEmitter");
      eventEmitter.emit("orderPlaced", order);

          return res.redirect("/customers/orders");
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
        },

        async show(req, res) {
            try {
                // Fetch the order by ID
                const order = await Order.findById(req.params.id);
                if (!order) {
                    return res.status(404).send('Order not found');
                }

                // Authorize user
                if (req.user._id.toString() === order.customerId.toString()) {
                    return res.render('customers/singleOrder', { order });
                }

                // If user is not authorized, redirect to home
                return res.redirect('/');
            } catch (err) {
                res.status(500).send(err);
            }
        }
    };
}

module.exports = orderController;
