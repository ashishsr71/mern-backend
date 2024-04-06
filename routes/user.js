const express=require("express");
const router= express.Router();
const jwt= require("jsonwebtoken");
const {User}=require('../mongo');
const bcrypt= require('bcryptjs');
const addAddress=require('../controller/address')
const{fetchOrderByUser,createOrder}=require('../controller/Order')
const verifyToken = require("../usermidleware");
const {getcartItems,addCartItem}= require('../controller/cart');
const getAddress= require('../controller/getAddress')


router.post("/login",async(req,res)=>{
      const {username,password}=req.body
      // console.log(username,password)
      try {
            const user= await User.findOne({username});
            // conosle.log(user)
           if(!user){return res.status(400).json({msg:"invalid creadentials"})}
            // console.log(user)
            const isMatch= await bcrypt.compare(password,user.password);
            if(!isMatch){return res.status(400).json({msg:'invalid creadentials'})};
console.log(isMatch)
      
           
            // console.log(isMatch)
         
            const token= jwt.sign({userId:user._id},"jai baba ki",{expiresIn:"1d"});
            res.cookie("token",token,{httpOnly:true,secure:true,maxAge:86400000});
            res.status(200).json({userId:user._id,token});

      } catch (error) {
            res.status(500).json({msg:"something went wrong"})
      }
})
router.get('/logout',async(req,res)=>{
res.cookie('token',null).json({msg:'loggged out'})
});

router.get('/validate-token',verifyToken,(req,res)=>{
      res.status(200).json({userId:req.userId})
})

router.post("/signup",async(req,res)=>{
      const {username,password}=req.body;
      try{
      const user= await User.findOne({username})
      if(user){return res.status(400).json({msg:"bsd request"})};
      const salt= await bcrypt.genSalt(10);
      const hash= await bcrypt.hash(password,salt);
      
      const newuser= await User.create({username,password:hash})

        const token= jwt.sign({userId:newuser._id},"jai baba ki",{expiresIn:"1d"});
        res.cookie("token",token,{httpOnly:true,secure:true,maxAge:86400000})
      
      return res.status(200).json({msg:"User registered",userId:newuser._id,token});
      }catch(err){
            console.log(err)
res.status(500).json({msg:"something went wrong"})
      }



});

router.get('/cartproducts',verifyToken,getcartItems);
router.post('/addincart',verifyToken,addCartItem);
router.post('/clearcart',verifyToken);
router.post("/addressadd",verifyToken,addAddress);
router.get("/getAddress",verifyToken,getAddress);
router.post("/createorder",verifyToken,createOrder);
router.get("/getorder",verifyToken,fetchOrderByUser);
router.post("/updateorder",verifyToken)

module.exports=router;