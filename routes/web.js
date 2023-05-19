const homeController=require("../app/http/controllers/homeController")
const authController=require("../app/http/controllers/authController")
const cartController=require("../app/http/controllers/customers/cartController")

const orderController = require("../app/http/controllers/customers/orderController")
const statusController = require("../app/http/controllers/admin/statusController")
const adminOrderController = require("../app/http/controllers/admin/orderController")
const adminItemController = require("../app/http/controllers/admin/itemController")
const adminPaymentController = require("../app/http/controllers/admin/paymentContoller")
const contactController = require("../app/http/controllers/services/contactController")
const supportController =require("../app/http/controllers/services/supportController")

//middlewares
const auth = require("../app/http/middlewares/auth")
const guest=require('../app/http/middlewares/guest')
const admin=require('../app/http/middlewares/admin')

function initRoutes(app){

app.get('/',homeController().index)
app.get('/contact',contactController().index)
app.post('/contact',contactController().postMessage)
app.get('/privacy',supportController().index)


app.get('/login',guest,authController().login)
app.post('/login',authController().postLogin)

app.post('/logout',authController().logout)

app.get('/register',guest,authController().register)
app.post('/register',authController().postRegister)

app.get('/cart',cartController().index)

app.post('/update-cart',cartController().update)


//customer routes
app.post('/orders',auth, orderController().store)

app.get('/customer/orders',auth, orderController().index)
app.get('/customer/orders/:id',auth, orderController().show)

//Admin routes
app.get('/admin/orders',admin, adminOrderController().index)
app.get('/admin/addItems',admin, adminItemController().index)
app.post('/admin/addItems',admin, adminItemController().addItems)

//stattus Routes
app.post('/admin/order/status',admin, statusController().update)
//PAYMENT STATUS UPDATE
app.get('/admin/order/payment/:id',admin, adminPaymentController().index)  
app.post('/admin/order/payment',admin, adminPaymentController().update)
}

module.exports=initRoutes