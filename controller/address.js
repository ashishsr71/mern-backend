const {Address}= require('../mongo');

const addAddress= async(req,res,next)=>{
const userId= req.userId;

try {
const newAdress=     await Address.create({userId,...req.body})
res.status(200).json({add:newAdress})

} catch (error) {
res.status(400).json({msg:"something went wrong in addressfunciton"})
}





};

module.exports=addAddress