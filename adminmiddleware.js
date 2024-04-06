const {Admin}= require('./mongo')



async function adminmiddleware(req,res,next){
      const username=req.body.username
      const password= req.body.password;

try {
      const admin= await Admin.findOne({
            username:username,
          
      })
      if(admin){
            res.status(400).json({msg:'enter with different email or username'})
      }else{
            next();
      }
     
} catch (error) {
      res.status(500).json({msg:'internal server error'})
      
}
   


}
module.exports= adminmiddleware;