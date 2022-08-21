const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,'please fill the username'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'please fill the password'],
        minLength:8
    },
    email:{
        type:String,
        required:[true,"please fill the email"],
        validate:[validator.isEmail,'please provide a vaild email']
    },
    role:{
        type: String,
        enum: ['doctor', 'admin'],
      },
})
userSchema.pre("save",async function(next){
 this.password=await bcrypt.hash(this.password,12)
})
 
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    console.log(candidatePassword,userPassword)
   return await bcrypt.compare(candidatePassword,userPassword)
}

const User=mongoose.model('User',userSchema)
module.exports=User
