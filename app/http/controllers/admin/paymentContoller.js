const Order = require("../../../models/order");

function paymentController()
{
return{
    async index(req,res)
     {
        const order= await Order.findById(req.params.id).populate('customerId','-password')
       return res.render('admin/payment',{order})
     },
     async update(req,res)
     {
      const {orders, paymentStatus } = req.body;
     // console.log(req.body);
      console.log(orders);
      // console.log(paymentStatus);
       await Order.findByIdAndUpdate(orders,{paymentStatus},{new:true})

         return res.render('admin/orders')
     }
    
      
    }
}


module.exports=paymentController