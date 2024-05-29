const cartController = require('../app/http/controllers/customer/cartcontroller')
const authController = require('../app/http/controllers/authController')
const homeController = require('../app/http/controllers/homeController')
const menuController = require ('../app/http/controllers/customer/menuController')
const sausageController = require ('../app/http/controllers/customer/sausageController')
const guest = require('../app/http/middlewares/guest')

function initRoutes(app){
    

    app.get("/", homeController().index )
    app.get("/cart", cartController().cart)
    app.get('/login',guest,authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register',guest,authController().register )
    app.post('/register',authController().postregister)
    app.post('/logout',authController().postlogout)
    app.get('/menu', menuController().menu)
    app.get('/sausage',sausageController().sausage )
    app.post('/update-cart',cartController().update)
 
}

    
module.exports = initRoutes  


      
      
      
      
      




