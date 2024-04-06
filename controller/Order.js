const {Orders}= require('../mongo');
const {Product}= require("../mongo");

const fetchOrderByUser=async(req,res)=>{
      const userId=req.userId;
      try {
            const orders=await Orders.find({userId:userId})
            res.status(200).json({allOrders:orders})
      } catch (error) {
            res.status(400).json({msg:"something went wrong in order"})
      }
};


const createOrder= async(req,res)=>{
      console.log(req.body)
      const order = new Orders({userId:req.userId,...req.body});
for(let item of order.items){
       await Product.updateOne({_id:item._id},{$inc:{quantity:-1*item.quantity}});
      // product.$inc("stock",-1*item.quantity);
      // await product.save();
}
try {
      const doc= await order.save()
      res.status(201).json(doc)
} catch (error) {
      console.log(error)
      res.status(401).json(error)
}

};


module.exports={createOrder,fetchOrderByUser}