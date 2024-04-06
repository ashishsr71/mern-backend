const {Cart}= require('../mongo')
const {Product}=require('../mongo')


async function getcartItems(req,res){
      const userId=req.userId;
      try {
            const cartItems=await Cart.find({userId:userId}).populate("cartproduct");
           if(cartItems.length<1){
            return res.status(200).json({msg:"cart is empty"})
           }

          res.status(200).json(cartItems)
                 
                  
                  
           
      } catch (error) {
            console.log(error)
            res.status(500).json({msg:"internal error"})
      }
}

async function addCartItem(req,res){
      const userId=req.userId;
      const proudctId=req.body.proudctId;
      try {
            const product=await Cart.findOne({cartproduct:proudctId})
            if(product){await Cart.findOneAndUpdate({cartproduct:proudctId},{$set:{quantity:req.body.quantity}})
        return res.status(200).json(product)
      };
            await Cart.create({userId:userId,cartproduct:proudctId,quantity:req.body.quantity})
            res.status(200).json({msg:'item added succesfully'})
      } catch (error) {
            res.status(500).json({msg:"server me error"})
      }
}

module.exports= {getcartItems,addCartItem};