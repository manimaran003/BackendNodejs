const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const app=require("./app")
const DB=process.env.DATABASE.replace('<PASSWORD>','Mangodb@1999')
mongoose.connect(DB,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false
}).then(con=>{
    console.log('db connected succesfully')
})
const port=process.env.PORT || 3007
app.listen(port,()=>{
    console.log("server running in the port",port)
})