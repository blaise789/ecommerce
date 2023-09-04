const mongoose=require("mongoose")
const Joi=require("joi")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
// const { config } = require("dotenv")
const UserSchema=new mongoose.Schema({
name:{
    type:String,
required:true,
maxlength:255,
minlength: 3

},
email: {
    type: String,
    required: [true,"Please enter your email"],
    unique: true,
    maxlength: 255,
    minlength: 3
},
password: {
    type: String,
    required: [true,"Please enter your password"],
    maxlength: 1024,
    minlength: [3,"Password should be greater than three characters"],
    select:false,
},
avatar:{
  
    type:String,
    
},
phoneNumber:{
    type:Number
},
addresses:[
    {
     
        country: {
            type: String,
          },
          city:{
            type: String,
          },
          address1:{
            type: String,
          },
          address2:{
            type: String,
          },
          zipCode:{
            type: Number,
          },
          addressType:{
            type: String,
          },    
    },
    
],
role:{
  type: String,
  default: "user",
},
createdAt:{
  type: Date,
  default: Date.now(),
 },
 resetPasswordToken: String,
 resetPasswordTime: Date,



})
UserSchema.pre("save", async function (next){
  if(!this.isModified("password")){
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
UserSchema.methods.getJwtToken=function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES})
}
UserSchema.methods.comparePassword= async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const User=mongoose.model('User',UserSchema)

// function validateUser(user){
//     const schema={
//         name:Joi.string().max(255).min(3),
//         email: Joi.string().max(255).min(3).required().email(),
//         password: Joi.string().max(255).min(3).required(),
//         isAdmin: Joi.required()
//     }
//     return Joi.validate(user,schema)
// }
// module.exports.validate=validateUser
module.exports.User=User