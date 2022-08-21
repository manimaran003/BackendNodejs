const Docter=require('../Models/DoctorModel')
const multer=require('multer')
const aws=require('aws-sdk')
const fs=require("fs")
const { v4: uuidv4 } = require('uuid');


const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        
        cb(null,'ImageStore/')
    },
    filename:(req,file,cb)=>{
        console.log(file)
        const ext=file.mimetype.split('/')[1]
        cb(null,`user-${Date.now()}.${ext}`)
    }
})
const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }
    else{
        cb(res.status(400).json({
            status:"faiure",
            message:"please upload only image"
        }),false)
    }
}
const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

exports.uploadUserPhoto=upload.single('doctorImage')
exports.DoctorsController=async(req,res)=>{
    console.log(req.body,"jam")
    try{
        console.log(req.body)
        const {doctorName,dob,country,address,email,phoneNumber,specialist}=req.body

        const duplicateuser=await Docter.findOne({email})
    
        if(duplicateuser){
            return res.status(400).json({
                status:"fail",
                message:"doctor already exists"
            })
        }
        let empId=uuidv4()
        let doctorsLink= fs.readFileSync("ImageStore/" + req.file.filename)
       const files=req.file;
       let img64= Buffer.from(doctorsLink).toString('base64')
       const message4 =  "data:"+files.mimetype+";base64,"+img64;
       let doctorImage=message4
        const doctor=await Docter.create({empId,doctorName,dob,country,address,email,phoneNumber,specialist,doctorImage})
            return res.status(200).json({
                status:"success"
            })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.GetAllDoctorController=async(req,res)=>{
    try{
        let query=Docter.find()
        console.log(query)
        //remove soe field to show the user
        query=query.select('-__v,')
        let doctorUser=await query
        console.log(doctorUser,'user')
        //let doctorsLink= fs.readFileSync("Public/" + doctorUser?.doctorImage)
        //console.log(doctorsLink,"buffer")
        // const encoded = doctorUser?.doctorImage?.buffer.toString('base64')
        // let contentType='image/jpeg'
        // let image="data:"+contentType+";base64,"+encoded;
        // let newUser={
        //     _id: doctorUser?._id,
        //     empId: doctorUser?.empId,
        //     doctorName: doctorUser?.doctorName,
        //     dob: doctorUser?.dob,
        //     country: doctorUser?.country,
        //     address: doctorUser?.address,
        //     email: doctorUser?.address,
        //     phoneNumber: doctorUser?.phoneNumber,
        //     specialist: doctorUser?.specialist,
        //     doctorImage:image
        // }
        //console.log(newUser,'JAMES')
        return res.status(200).json({
            status:"success",
            doctorUser
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.doctorUpdate=async(req,res,next)=>{
    try{
       await Docter.findByIdAndUpdate(req.params.id,req.body,{ runValidators: true })
        return res.status(200).json({
            status:"success",
            message:"successfully docted edited"
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.doctorDelete=async(req,res,next)=>{
    console.log(req.params.id)
    try{
        await Docter.findByIdAndDelete(req.params.id,{active:false})
        return res.status(200).json({
            status:"success",
            message:"successfully docter deleted"
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}