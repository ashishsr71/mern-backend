require('dotenv').config();


const express = require('express');


const stripe = require("stripe")('sk_test_51P1AQISJP765TakG7u8hBMzd6ualVTWXmXwq3v8ysEWG7Kxpxtl8N5Mo0cOYW3CZjJW1uwPuMLW9CPyMAri3CIYk00MozvBe5T');
// const createProduct =require('./controller/Product')
const {Product,Orders}=require('./mongo');
const mongoose= require('mongoose');
const cors= require('cors')
const userRouter= require("./routes/user")
const cookieParser=require('cookie-parser')
const adminrouter=require('./routes/admin')
const fetchAllProducts=require('./Schemamiidleware/productschema')

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/user",userRouter);
app.use("/admin",adminrouter)



// this is stripe webhook
const endpointSecret=process.env.Stripe_secret
app.post(
      '/webhook',
      express.raw({ type: 'application/json' }),
      async (request, response) => {
        const sig = request.headers['stripe-signature'];
    
        let event;
    
        try {
          event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
          response.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
    
        // Handle the event
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
    
            const order = await Orders.findById(
              paymentIntentSucceeded.metadata.orderId
            );
            order.paymentStatus = 'received';
            await order.save();
    
            break;
          // ... handle other event types
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
    
        // Return a 200 response to acknowledge receipt of the event
        response.send();
      }
    );




app.get("/singleProduct/:id",async(req,res)=>{
      const product=await Product.findOne({_id:req.params.id});
      if(product){
        return res.status(200).json({product});   
      };
    return   res.status(400).json({msg:"bad request"})
})
app.get("/products",async function(req,res){
  let query= Product.find({})
  
  if(req.query.category){
        query= query.find({"category":req.query.category})
  }
  if(req.query.sort && req.query.order){
        query=query.sort({[req.query.sort]:req.query.order});
  }
  if(req.query.skip&&req.query.limit){
        const pageSize= req.query.limit;
        const skip= req.query.skip;
        query= query.skip(skip).limit(pageSize);
  }
  
  try {
        const docs= await query.exec();
        res.status(200).json(docs);
  } catch (error) {
        res.status(400).json(err)
  }
  })

//   this is user api to initiate on node js 
app.post('/create-payment-intent', async (req, res) => {
      const { totalAmount, orderId } = req.body;
    
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // for decimal compensation
        currency: 'inr',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId,
        },
      });
    
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    })


  main().catch((err) => console.log(err));

  async function main() {
    await mongoose.connect('mongodb+srv://ashish:Daksh2015@cluster0.vhbo1gu.mongodb.net/puss')
    console.log('database connected');
  }
  


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
