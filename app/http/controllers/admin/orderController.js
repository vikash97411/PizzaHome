const Order=require("../../../models/order")
function orderController()
{
return{
    async index(req,res)
    {
       const order= await Order.find({status:{$ne:'completed'}},null,{sort:{'createdAt':-1}})
        .populate('customerId','-password');
      
              if(req.xhr)
            {
                return res.json(order)
            }else{
                return res.render('admin/orders')
            }
        }
          
            
    
    }
}


module.exports=orderController