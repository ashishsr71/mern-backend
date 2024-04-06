const mongoose= require('mongoose');
// const { string } = require('zod');
const Schema= mongoose.Schema;
// try {
//       mongoose.connect('mongodb+srv://ashish:Daksh2015@cluster0.vhbo1gu.mongodb.net/puss') 
// } catch (error) {
//      console.log("connection me error") 
// }

// const Userschema=new Schema({
//       email:String,
//       password:String,
    
// });
const Userschema= new Schema({
      username:{type:String,required:true},
      password:{type:String,required:true}
});

const AdminSchema= new Schema({
      username:{type:String,required:true},
      password:{type:String,required:true},
      products:[{type:Schema.Types.ObjectId,ref:"Product"}],
      role:{type:String,default:"Admin"}
})


const productSchema= new Schema({
      title:{type:String, required:true},
      description:{type:String,required:true},
      price:{type:Number,min:[0,'wrong min price'],max:[10000,'wrong max price']},
      discountPercentage:{type:Number,min:[0,'wrong min percentage'],max:[100,'wrong max percentage']},
      rating:{type:Number,min:[0,'wrong rating'],max:[6,'wrong max rating'],default:0},
      stock:{type:Number,min:[0,'wrong min stock']},
      brand:{type:String,required:true},
      category:{type:String,required:true},
      thumbnail:{type:String,required:true},
      images:{type:[String],required:true},
      deleted:{type:Boolean,default:false}
})

const cartSchema= new Schema({
      userId:{type:String,required:true},
      cartproduct:{type:mongoose.Types.ObjectId,ref:'Product'},
      quantity:{type:Number,default:1},
      size:{type:String},
      color:{type:String}

});
const orderSchema= new Schema({
      userId:{type:String,required:true},
      items:{type:[Schema.Types.Mixed],required:true},
      paymentMethod:{type:String},
      totalAmount:{type:Number},
      paymentStatus:{type:String,default:"pending"},
      status:{type:String,default:"pending"},
      selectedAddress:{type:Schema.Types.Mixed,required:true},
      delivered:{type:Boolean,default:false},
     
},{timestamps:true});

const AdressesSchema= new Schema({
      userId:{type:String,required:true},
       pincode:{type:Number,required:true},
       state:{type:String,required:true},
       district:{type:String,required:true},
       locality:{type:String,required:true}
});



const Admin= mongoose.model("Admin",AdminSchema)
const Product=  mongoose.model('Product',productSchema);
const User=   mongoose.model('User',Userschema);
const Cart=   mongoose.model("Cart",cartSchema);
const Orders= mongoose.model("Orders",orderSchema);
const Address= mongoose.model("Address",AdressesSchema)

module.exports={Product,User,Cart,Orders,Address,Admin};


