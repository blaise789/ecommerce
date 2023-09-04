const express=require("express")
const {User}=require("../model/user")
// const cloudinary=require("cloudinary")
const catchAsyncError=require("../middleware/catchAsyncErrors")
const jwt=require("jsonwebtoken")
const ErrorHandler = require("../utils/ErrorHandler")
const sendMail = require("../utils/sendMail")
const router=express.Router()
const sendToken=require("../utils/jwtToken")
const { isAuthenticated } = require("../middleware/auth")
const { upload } = require("../multer")
const path=require("path")

router.post("/create-user",upload.single("file"), async (req,res,next)=>{
  try{ 
    // const {error}=validate(req.body)
    // if(error) {
    //   return next(new ErrorHandler("Pleade Provide all the fields",400))
    // }
     const {name,email,password,avatar}=req.body


     const userEmail=await User.findOne({email})
if(userEmail){
    
    return next(new ErrorHandler("User already exists",400))
 
}
// const myCloud=await cloudinary.v2.uploader.upload(avatar,{
//   folder:"avatars"
// })
const filename=req.file.filename
const  fileUrl=path.join(filename)



const user={
    name:name,
    email:email,
    password:password,
    avatar:fileUrl
}

// create activation token 
const activationToken=createActivationToken(user)
const activationUrl=`http://localhost:3000/activation/${activationToken}`
 try{
 await sendMail(
  {
    email:user.email,
    subject:`Activate your account`,
    message:`Hello ${user.name} please click on the link to activate your account:${activationUrl}`
  }
 )
 res.status(201).json({
  success:true,
  message:`Please check you email:${user.email} to activate your account`
 }
 )
 }
 catch(error){
  return next(new ErrorHandler(error.message,500))

 }  

}
  catch(error){
    console.log(error.message)
return next(new ErrorHandler(error.message,400))
  }
})
// activation token   
const createActivationToken=(user)=>{
  return jwt.sign(user,process.env.ACTIVATION_SECRET,{
    expiresIn:'30m'
  })
}

// activate User

router.post("/activation",catchAsyncError(async(req,res,next)=>{

  try{
       const { activation_token } =req.body
       const newUser=jwt.verify(activation_token,process.env.ACTIVATION_SECRET)
       if(!newUser){
        return next(new ErrorHandler("Invalid Token",400))
       }
       const {name,email,password,avatar}=newUser
     let user=await User.findOne({email})
       if(user){
        return next(new ErrorHandler("User already exists "))
       }
   let person=  await User.create({
        name,
        email,
        password,
        avatar
       })
       
       sendToken(person,201,res)
       
  }
  catch (err){
    console.log(err.message)
 return next(new ErrorHandler(err.message,500))
  }
}))
//  login user
router.post(
"/login-user",
catchAsyncError(async (req,res,next)=>{

  try{ 
    // const {error}=validate(req.body)
    // if(error) {
    //   return next(new ErrorHandler("Pleade Provide all the fields",400))
    // }
    const {email,password}=req.body
  const user=await User.findOne({email}).select("+password")
 if(!user){
   return  next( new ErrorHandler("User doesn't exists"))
 }
 const isPasswordValid=await user.compare(password)
 if(!isPasswordValid){
  return next(
    new ErrorHandler("invalid account details ")
  )
 }
 sendToken(user,201,res)
  }
  catch(error){
    return next(new ErrorHandler(error.message),500)

  }
})
)

router.get("/getUser",isAuthenticated,catchAsyncError(
  async (req,res,next)=>{
    try {
      const user=await User.findById(req.user.id)
      if(!user){
        return next(new ErrorHandler("user doesn't  exists ",400))
      }
 res.status(200).json({
  success:true,
  user
 })
    }
    catch(error){
 return next(new ErrorHandler(error.message,500))
    }
  }
)
)
router.get("/logout",catchAsyncError(async (req,res,next)=>{
  try{
res.cookie("token",null,{
  expires:new Date(Date.now()),
  httpOnly:true,
   sameSite:"none",
   secure:true
})
res.status(201).json({
  success:true,
  message:"log out successfully"
})
  }
  catch(error){
    return next(new ErrorHandler(error.message,500))

  }
}))
router.put("/update-user-info",isAuthenticated,catchAsyncError(
  async  (req,res,next)=>{
 try{
  const {email,password,phoneNumber,name}=req.body
  const user= await User.findOne({email}).select("+password")
 if(!user){
   return next(new ErrorHandler("User not found",400)
   )
 }
 const isPasswordValid=await user.comparePassword(password)
 if(!isPasswordValid){
  return next(new ErrorHandler("Please provide the correct information",400))

 }
 user.name=name;
 user.email=email;
 user.phoneNumber=phoneNumber
 await user.save()
 res.status(201).json({
  success:true,
  user,
 })
 

}
catch(error){
  return next(new ErrorHandler(error.message,500) )
}

  }
))
// router.put("/update-avatar",isAuthenticated,catchAsyncError(async (req,res,next)=>{
//   try{
//     let existUser=await User.findById(req.user.id)
//     if(req.body.avatar !== "" ){
//       const imageId=existUser.avatar.public_id
//      await cloudinary.v2.uploader.destroy(imageId)
//   const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
//     folder:"avatar",
//     width:150
//   })
//   existUser.avatar={
//     public_id:myCloud.public_id,
//     url:myCloud.secure_url
//   }
//   await existUser.save()
//     }

//   }
//   catch(error){
//      return  next(new ErrorHandler(error.message,500))
//   }
// }))
// router.put("/update-user-addresses",isAuthenticated,catchAsyncError(
//   async (req,res,next)=>{
//     try{
//       const user=await User.findById(req.user.id)
//       const sameTypeAddress=user.addresses.find((address)=>address.addressType===req.body.addressType)
//       if(sameTypeAddress){
//         return next(
//           new ErrorHandler(`${req.body.addressType} address already exists `)
//         )
//       }
//      const existsAddress=user.addresses.find(
//     (address)=>address._id ===req.body._id
//      )
//     }
//     catch(error){
//       return next(new ErrorHandler(error.message,500))
//     }
//   }
// ))
module.exports=router