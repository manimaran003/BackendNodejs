const express=require("express")
const userRouter=require('./routes/userRoutes')
const DoctorRouter=require('./routes/DoctorRoutes')
const PatientRouter=require('./routes/PatientRoutes')
const app=express()
const cors = require('cors');
const corsOptions ={
    origin:'https://abc-hospital-demo.vercel.app', 
    credentials:true,          
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json())
// app.use("/auth",jwtRouter)
app.use("/authenticate",userRouter)
app.use("/doctor",DoctorRouter)
app.use("/patient",PatientRouter)
module.exports=app