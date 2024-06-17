const cartController = require("../app/http/controllers/cartController");
const authController = require("../app/http/controllers/authController");
const homeController = require("../app/http/controllers/homeController");
const orderController = require("../app/http/controllers/orderController");
const auth = require('../app/http/middlewares/auth')
const guest = require("../app/http/middlewares/guest");
const AdminOrderController = require('../app/http/controllers/AdminOrderController')
const admin = require('../app/http/middlewares/admin')
const statusController = require('../app/http/controllers/statusController')

function initRoutes(app) {
  app.get("/", homeController().index);
  app.get("/cart", cartController().cart);
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postregister);
  app.post("/logout", authController().postlogout);
  app.post("/update-cart", cartController().update);
  app.post("/orders", auth, orderController().store);
  app.get('/customers/orders', auth, orderController().index);
  app.get('/customers/orders/:id', auth, orderController().show);
  app.get('/customers/adminOrder', admin, AdminOrderController().index);
  app.post('/admin/order/status', admin, statusController().update);

}



module.exports = initRoutes;
