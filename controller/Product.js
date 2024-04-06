const{Product}= require('../mongo');

exports.createProduct=async(req,res)=>{
      // this product we have
      try {
            const product=new Product(req.body);
            const response= await product.save();
            console.log(response) 
            res.status(200).json({
                  msg:response
            })   
      } catch (error) {
            res.status(400).json(response)
      }
      
      
};

exports.getAllproducts= async(req,res)=>{
      try {
           const products= await Product.find({});
           res.status(200).json(products)
      } catch (error) {
            res.status(400).json(error)
      }
};

// exports.getsingleProduct=async()=>{

// }