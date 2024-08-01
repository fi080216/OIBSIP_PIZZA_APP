const { ServerDescription } = require("mongodb");

const Order = require("../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
  return {
    store(req, res) {
      const { phone, address, stripeToken, paymentType } = req.body;

      // Check if phone and address are provided
      if (!phone || !address) {
        return res.status(422).json({ message: "All fields are required" });
      }

      // Create a new order instance
      const order = new Order({
        customerId: req.user._id, // Ensure req.user._id is available
        items: req.session.cart.items, // Ensure req.session.cart.items contains the expected data
        phone,
        address,
        // paymentType: 'COD', // Set default payment type if not provided
        // status: 'order_placed' // Set default status if not provided
      });

      // Save the order to the database
      order
        .save()
        .then((order) => {
          // req.flash("success", "Order placed successfully !")
          //stripe payment

          if (paymentType === "card") {
            stripe.charges
              .create({
                amount: req.session.cart.totalPrice * 100,
                source: stripeToken,
                currency: "inr",
                description: `Pizza order: ${order._id}`,
              })
              .then(() => {
                order.paymentStatus = true;
                order
                  .save()
                  .then((ord) => {
                    console.log(ord);
                    const eventEmitter = req.app.get("eventEmitter");
                    eventEmitter.emit("orderPlaced", ord);
                    delete req.session.cart;
                    return res.json({
                        message: "Payment successful, Order placed successfully !",
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((err) => {
                delete req.session.cart;
                return res.json({
                  message: "Order placed but payment failed!, You can pay at delivery time.",
                });
              });
          }

          

          
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Something went wrong while placing order !",
              });
          
        });
    },

    async index(req, res) {
      const orders = await Order.find(
        {
          customerId: req.user._id,
        },
        null,
        { sort: { createdAt: -1 } }
      );
      res.render("customers/orders", { orders: orders, moment: moment });
      // console.log(orders)
    },

    async show(req, res) {
      try {
        // Fetch the order by ID
        const order = await Order.findById(req.params.id);
        if (!order) {
          return res.status(404).send("Order not found");
        }

        // Authorize user
        if (req.user._id.toString() === order.customerId.toString()) {
          return res.render("customers/singleOrder", { order });
        }

        // If user is not authorized, redirect to home
        return res.redirect("/");
      } catch (err) {
        res.status(500).send(err);
      }
    },
  };
}

module.exports = orderController;
