const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
const Menu = require("../../../models/menu")

function itemController()
{
    return{
        index(req,res)
        {
            res.render('admin/addItems')
        },
        addItems(req,res)
        {
            const {name,price,size,}=req.body;
            if(!name || !price || !size)
            {
                req.flash('error','All fields are required.')
                return res.redirect("/admin/addItems")
            }

            if(req.files){
                console.log(req.files);
                const image=req.files.image
                cloudinary.uploader.upload(image.tempFilePath,{
                    public_id:`${Date.now()}`,
                    resource_type:'auto',
                    folder:'image'
                },(err,result)=>{
                    if(result)
                    {
                      console.log(result.url);
                      Menu.create({
                        name,
                        price,
                        size,
                        image:result.url
                      })
                    }
                    if(err)
                    {
                        console.log(err)
                    }
                  
                })
            }
             return res.redirect("/admin/addItems")
        }
    }
}

module.exports=itemController