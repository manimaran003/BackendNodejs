const mongoose=require('mongoose')
const validator=require('validator')

const DoctorSchema=mongoose.Schema({
    empId:{
         type:String,
        required:[true,'please fill the doctorname'],
        unique:true
    },
    doctorName:{
        type:String,
        required:[true,'please fill the doctorname']
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
    specialist:{
        type:String,
        require:[true,'please fill the specialist'],
    },
    dob:{
        type:Date,
        require:[true,"please fill the date"]
    },
    country:{
        type:String,
        require:[true,"please fill the country"]
    },
    doctorImage:{
        type:String,
    }
})

const Docter=mongoose.model("Docter",DoctorSchema)
module.exports=Docter