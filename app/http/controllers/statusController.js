const Order = require("../../../app/models/order");

function statusController() {
  return {
    async update(req, res) {
      await Order.updateOne(
        { _id: req.body.orderId },
        { status: req.body.status }
      );

      const eventEmitter = req.app.get("eventEmitter");
      eventEmitter.emit("orderUpdated", {
        id: req.body.orderId,
        status: req.body.status,
      });

      res.redirect("/customers/adminOrder");
    },
  };
}

module.exports = statusController;
