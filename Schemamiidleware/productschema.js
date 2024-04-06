const {Product}= require('../mongo')
const schemaMiddle= async function(req,res,next){
      try {
           const output=await Product.findOne({title:req.body.title}) 
           if(output){ res.json({msg:'product already exists'})}
           else{
            next();
           } 
          

      } catch (error) {
            res.josn({msg:'something went wrong'})
      }

}

const fetchAllProducts= async function(req,res){
let query= Product.find({})

if(req.query.category){
      query= query.find({"category":req.query.category})
}
if(req.query.sort && req.query.order){
      query=query.sort({[req.query.sort]:req.query.order});
}
if(req.query.page&&req.query.limit){
      const pageSize= req.query.limit;
      const page= req.query.page;
      query= query.skip(pageSize*(page-1)).limit(pageSize);
}

try {
      const docs= await query.exec();
      res.status(200).json(docs);
} catch (error) {
      res.status(400).json(err)
}
}

module.exports={fetchAllProducts,schemaMiddle}