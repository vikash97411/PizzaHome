 function supportController()
{
  return {
    index(req,res)
    {
        return res.render('services/privacy_policy')
    }
  }
}

module.exports=supportController