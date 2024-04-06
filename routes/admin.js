const {Router}= require('express')
const adminmiddleware= require('../adminmiddleware')
const adminrouter= Router();
const {Admin}= require('../mongo');
const { createProduct } = require('../controller/Product');



const bcrypt= require('bcryptjs');
const jwt= require("jsonwebtoken");


adminrouter.post('/signup',adminmiddleware,async(req,res,)=>{
      const username=req.body.username;
      const password = req.body.password;
try {
      const salt= await bcrypt.genSalt(10);
      const hash= await bcrypt.hash(password,salt);
    const newAdmin=  await Admin.create({username,password:hash})
    const token= jwt.sign({AdminId:newAdmin._id},"jai baba ki",{expiresIn:"1d"});
    res.cookie("token",token,{httpOnly:true,secure:true,maxAge:86400000})
    return res.status(200).json({msg:"Admin registered",AdminId:newAdmin._id})
} catch (error) {
      console.log(error)
res.status(500).json({msg:'internal dikkat hai'})
}
      
 

});


adminrouter.post('/createproduct',createProduct)



module.exports= adminrouter;