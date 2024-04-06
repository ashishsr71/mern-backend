const {Address}= require('../mongo');


const getAddress= async(req,res,next)=>{
      try {
         const allAddresses= await Address.find({userId:req.userId})            
      if(allAddresses.length){res.status(200).json({allAddresses})}
      res.status(201).json({allAddresses:[]});
      } catch (error) {
            
      }
}
module.exports=getAddress;
