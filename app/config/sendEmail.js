const nodemailer = require("nodemailer");
async function sendEmail(name,email,message)
{
    console.log(name,email,message);
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'merl.wilkinson1@ethereal.email',
        pass: 'UsdXqDnZBYb3gVz5c5'
    }
});
  let info = await transporter.sendMail({
    from: email, // sender address
    to: "techsoftcrews@gmail.com, mrvikash93@gmail.com", // list of receivers
    subject: "Hello "+name, // Subject line
    text: message, // plain text body
    html: "<b>"+message+"</b>", // html body
  });
   console.log("Message sent: %s", info.messageId);
}
module.exports=sendEmail