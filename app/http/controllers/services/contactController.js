const sendEmail = require("../../../config/sendEmail");
const Message = require("../../../models/message")

 function contactController()
{
  
  return {

    
   

    index(req,res)
    {
        return res.render('services/contact')
    },
   async postMessage(req,res)
    {
        try {
            console.log(req.body);
            const {name,email,message} =req.body;
            const msg= await Message.create(req.body)
            sendEmail(name,email,message)
            return res.render('services/contact')
        } catch (error) {
            console.log(error)
        }
       

    }
  }
}

module.exports=contactController