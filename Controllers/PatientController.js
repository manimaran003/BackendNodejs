const Patient=require('../Models/PatientModel')
const { v4: uuidv4 } = require('uuid');
const multer=require('multer')
const aws=require('aws-sdk')
const fs=require("fs")

const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'ImageStore/')
    },
    filename:(req,file,cb)=>{
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

exports.uploadPatientPhoto=upload.single('patientImage')

exports.AddPatientController=async(req,res)=>{
    console.log(req.body,"camed")
    console.log(req.file,"file")
    try{
        const {patientName,dob,country,address,email,phoneNumber,ageField,admitDate}=req.body

        const duplicateuser=await Patient.findOne({email})
        console.log(duplicateuser,"duplicate")
    
        if(duplicateuser){
            return res.status(400).json({
                status:"fail",
                message:"patient already exists"
            })
        }
         let doctorsLink= fs.readFileSync("ImageStore/" + req.file.filename)
         console.log(doctorsLink)
        const files=req.file;
        let img64= Buffer.from(doctorsLink).toString('base64')
        const message4 =  "data:"+files.mimetype+";base64,"+img64;
        // const s3 = new aws.S3({
        //     accessKeyId:process.env.AWS_ACCESS_KEY_ID,              // accessKeyId that is stored in .env file
        //     secretAccessKey:process.env.AWS_ACCESS_KEY_SECRET       // secretAccessKey is also store in .env file
        // })
        // const params = {
        //     Bucket:process.env.AWS_BUCKET_NAME,     
        //     Key:req.file.originalname,               
        //     Body:doctorsLink,                 
        //     ContentType:req.file.mimetype         
        // };
        // console.log(params)
        let patientId=uuidv4()
        let patientImage=message4
    //    s3.upload(params,async(error,data)=>{
    //         if(error){
    //             console.log(error)
    //         }
    //         console.log("awsupload",data)
    //        let patientImage=data?.Location 
    //     })
    const patient=await Patient.create({patientId,patientName,dob,country,address,email,phoneNumber,ageField,admitDate,patientImage})
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

exports.GetPatientController=async(req,res)=>{
    try{
        let query=Patient.find()
        query.select("-__v")
        let patient=await query
        console.log(patient)
        return res.status(200).json({
            status:"success",
            patient
        })
    }
    catch(err){
      res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.DeletePatientController=async(req,res)=>{
    console.log(req.params.id)
    try{

        // const s3 = new aws.S3({
        //     accessKeyId:process.env.AWS_ACCESS_KEY_ID,              // accessKeyId that is stored in .env file
        //     secretAccessKey:process.env.AWS_ACCESS_KEY_SECRET       // secretAccessKey is also store in .env file
        // })
        // s3.deleteObject({
        //     Bucket: MY_BUCKET,
        //     Key: 
        //   },function (err,data){})
        await Patient.findByIdAndDelete(req.params.id,{active:false})
        return res.status(200).json({
            status:"succes",
            message:"deleted successfully"
        })
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }

}

exports.GetPatientById=(req,res,next)=>{
    try{
        const PatientUser=Patient.findById(req.param.id)
        return res.status(200).json({
            status:"success",
            PatientUser
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.UpdatePatientById=async(req,res,next)=>{
    console.log(req.body)
    console.log(req.params.id)

    try{
        await Patient.findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
        return res.status(200).json({
            status:"success",
          message:"successfully edited user"
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

