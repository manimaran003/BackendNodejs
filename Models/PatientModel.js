const mongoose=require('mongoose')
const validator=require('validator')

const PatientSchema=mongoose.Schema({
    patientId:{
        type:String
    },
    patientName:{
        type:String,
        required:[true,'please fill the patientName'],
        unique:true
    },
    address:{
        type:String,
        require:[true,'please fill the address']
    },
    email:{
        type:String,
        require:[true,'please fill the email'],
        validate:[validator.isEmail,'please provide a vaild email']
    },
    phoneNumber:{
        type:String,
        require:[true,'please fill the phonenumber'],
    },
    dob:{
        type:Date,
        require:[true,"please fill the date"]
    },
    country:{
        type:String,
        require:[true,"please fill the country"]
    },
    ageField:{
        type:Number,
        require:[true,"please fill the age"]
    },
    admitDate:{
        type:Date,
    },
    patientImage:{
        type:String,
    }
})
const Patient=mongoose.model("Patient",PatientSchema)
module.exports=Patient