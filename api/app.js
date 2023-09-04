const express=require("express")
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")
const ErrorHandler = require("./middleware/error")
const cors=require("cors")
const app=express()
const morgan=require("morgan")

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true,limit:"100mb"}))
app.use(cors(
    {
        origin:["http://localhost:3000"],
        credentials:true,
        // allowedHeaders:true
    }
))
app.use(morgan("common"))
app.use("/",express.static("uploads"))
//config
if(process.env.NODE_ENV !=="PRODUCTION"){
    require("dotenv").config({
        path:'api/config/.env'
    }
    )
}
app.options("*", cors());
// import Routes
const user=require("./controller/user")

 
// const shop = require("./controller/shop");
// const product = require("./controller/product");
// const event = require("./controller/event");
// const coupon = require("./controller/coupounCode");
// const payment = require("./controller/payment");
// const order = require("./controller/order");
// const conversation = require("./controller/conversation");
// const message = require("./controller/message");
// const withdraw = require("./controller/withdraw");




app.use("/api/v2/user",user)
// app.use("/api/v2/conversation",conversation)
// app.use("/api/v2/message",message)
// app.use("/api/v2/order",order)
// app.use("/api/v2/shop",shop)
// app.use("/api/v2/product",product)
// app.use("/api/v2/event",event)
// app.use("/api/v2/coupon",coupon)
// app.use("/api/v2/withdraw",withdraw)


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Set the appropriate origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Your API routes and logic here


// //  It's for Error Handling
app.use(ErrorHandler)
module.exports=app
// if we are not producing 