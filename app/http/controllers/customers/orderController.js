const Order =require("../../../models/order")
const moment=require('moment')
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)

 function orderController()
{
    return {
       async store(req,res){
        const { phone,address,stripeToken,paymentType} =req.body;
        console.log(req.body)
        if(!phone || !address)
        {
            return res.status(422).json({message:'All fields are required'})
                       
        }
            try {
                const order=new Order({
                        customerId:req.user._id,
                        items:req.session.cart.items,
                        phone,
                        address,
                        paymentType

                    })
                    await order.save()
                    const populatedOrder =await Order.populate(order,{path:'customerId'})
                //stripe payment
                if(paymentType === 'card')
                {
                    //console.log(populatedOrder.customerId.email);
                   
                   await stripe.paymentIntents.create({
                        amount:req.session.cart.totalPrice * 100,                
                        payment_method_types:["card"],
                        currency:'inr',
                        description:`pizza order: ${populatedOrder._id}`
                    }).then(()=>{
                        populatedOrder.paymentStatus =true;
                        populatedOrder.save().then((ord)=>{
                        const eventEmitter=req.app.get('eventEmitter')
                         eventEmitter.emit('orderPlaced',ord)
                        delete req.session.cart
                         return res.json({message:'Payment successful,Order placed successfully'})

                        }).catch(err=>{
                            console.log(err);
                        })
                         
                    }).catch(err=>{
                        delete req.session.cart
                        console.log(err)
                        return res.json({message:'Order placed but Payment failed,you can pay at delivery time'})
                    })
                }else{
                        const eventEmitter=req.app.get('eventEmitter')
                         eventEmitter.emit('orderPlaced',populatedOrder)
                         delete req.session.cart
                        return res.json({message:'Order placed successfully , Pay on delivery'})   
                }
                        
                
            } catch (error) {
                 return res.status(500).json({message:'Something went wrong.'})
            }
        


        },
       async index(req,res)
        {
        const orders =await Order.find({customerId:req.user._id},null, {sort:{'createdAt':-1}})
        res.header('Cache-Control','no-cache, private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
        res.render('customers/orders',{orders:orders,moment:moment})
        },
        async show(req,res)
        {
            const order=await Order.findById(req.params.id)
            //Authorize User
            if(req.user._id.toString() === order.customerId.toString())
            {
                return res.render("customers/singleOrder",{order})
            }
                return res.redirect("/")
            
        }
        
        
    }
}

module.exports=orderController