const {User}= require('./mongo')
const jwt= require("jsonwebtoken")
const {jwtPayload}= require("jsonwebtoken")
function usermiddleware(req,res,next){
User.findOne({
    username:req.headers.username,
    password:req.headers.password  
}).then(value=>{
      if(value){
            next()
      }else{
            res.json({
                  msg:'invalid username or password'
            })
      }
})


}

const verifyToken= (req,res,next)=>{
const token= req.headers["token"];
console.log(token + "jai baba ki")
if(!token){return res.status(401).json({message:"unauthorised"})};
try {
      
      const decoded=jwt.verify(token,"jai baba ki");
      if(!decoded){return res.status(401).json({msg:"unauthio"})}
//   console.log(decoded);
      req.userId=decoded.userId;
      next();
} catch (error) {
      console.log(error)
      res.status(400).json({msg:"something went wrong in verify token"})
}
}

module.exports= verifyToken;