const User=require('../Models/UserModel')
const jwt=require('jsonwebtoken')
const Patient=require("../Models/PatientModel")
const Docter=require("../Models/DoctorModel")
const SignIn=(id,expiry)=>{
    console.log(id)
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:`${expiry}ms`})
}
exports.SignUpControll=async(req,res)=>{
    try{
        const {username,password,email,role}=req.body
        console.log("camed",req.body)
        //check already user signup guy logged in
        const checkPerson=await User.findOne({email})
        console.log('yes',checkPerson)
        if(checkPerson){
           return  res.status(400).json({
                status:"fail",
                message:"email already exists"
            })  
        }
        else{
            const userData=await User.create({
                username,password,email,role
            })
            console.log("userdata",userData._id)
            const token=SignIn(userData._id,50) 
            return res.status(200).json({
               status:"success",
               token,
               role
           })
        }
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}
exports.LoginControll=async(req,res)=>{
    try{
        const {email,password}=req.body
        console.log(req.body)
        const userData=await User.findOne({email}).select('+password')
        console.log(userData)
        // let RoleData;
        // if(role==="patient"){
        //     RoleData=Patient.findOne({email})
        //     RoleData= await RoleData.select("patientImage")
        // }
        // if(role==="doctor"){
        //     RoleData=Docter.findOne({email})
        //     RoleData= await RoleData.select("doctorImage")
        // }
        // if(role==="admin"){
        //     RoleData=Docter.findOne({email})
        //     RoleData= await RoleData.select("doctorImage")
        // }
        if(!userData||!(await userData.correctPassword(password,userData.password))){
            return res.status(401).json({
                status:"fail",
                message:"incorrect password or email"
            })
        }
       // const token=SignIn(userData._id,30000)
        let tok= userData._id
       const token=  jwt.sign({tok},process.env.JWT_SECRET,{expiresIn:'5m'})
        const refreshToken=jwt.sign({tok},process.env.JWT_SECRET,{expiresIn:'20m'})
        res.status(200).json({
            status:"success",
            token,
            refreshToken,
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.getAllUser=async(req,res,next)=>{
    try{
        let query=User.find()
        //remove the password field in obj
        query.select('-password')
        const userData=await query

        res.status(200).json({
            status:"success",
            data:{
                userData
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
}
}

const JwtCatchError=(err,res)=>{
    const { TokenExpiredError } = jwt;
 
      if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
      }
      return res.sendStatus(401).send({ message: "Unauthorized!" });
}


exports.ProtectedRoute=async(req,res,next)=>{
    let token;
    console.log("pro",process.env.JWT_SECRET)
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    //     token=req.headers.authorization.split(' ')[1]
    //     console.log(token)
    // }
    if(req.headers.authorization){
             token=req.headers.authorization
        console.log(token)
    }
    if(!token){
       return res.status(401).json({
            status:"fail",
            message:"no token provided"
        })
    }
    //let decode=jwt.verify(token,process.env.JWT_SECRET)
     await jwt.verify(token, process.env.JWT_SECRET, async(err,decode) => {
        console.log(err,"kelvin")
        console.log(decode,"jam")
         const currentUser =  await User.findById(decode?.id);
       req.user=currentUser
        if (err) {
          return JwtCatchError(err, res);
        }
        next();
      });
}

exports.refreshController=async(req,res)=>{
    console.log(req.headers.authorization)
    let refreshToken;
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    //     refreshToken=req.headers.authorization.split(' ')[1]
    // }
     if(req.headers.authorization){
        refreshToken=req.headers.authorization
    }
    let DecodeData=jwt.decode(refreshToken)
    console.log("newDecode",DecodeData)
    if(DecodeData){
        const id=DecodeData._id
       const newAccess =jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'5m'})
       // const newAccess=SignIn(DecodeData._id,10) 
        return res.status(200).json({
            status:"success",
                newAccess,
                refreshToken
            
        })
    }
}




exports.restrictAccess=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status:"fail",
                message:"no access to delete"
            })
        }
        next()
    }
}