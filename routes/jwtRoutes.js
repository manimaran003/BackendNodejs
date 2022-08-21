const express=require("express")
const aws = require('aws-sdk');
const {tours}=require("../Data/data")
const {getAllUsers,PostNewData,PostNewLogin,refreshTokenHandler,checkAuth}=require("../Controllers/jwtController")
const router=express.Router()
router.route("/alluser").get(getAllUsers)
router.route("/signup").post(PostNewData)
router.route("/login").post(PostNewLogin)
router.route("/refresh").post(refreshTokenHandler)
router.get("/getimage",(req,res)=>{
    let s3=new aws.S3({ accessKeyId:process.env.AWS_ID, secretAccessKey: process.env.AWS_KEY })
    let params={Bucket:process.env.BUCKET_NAME,Key:process.env.KEY_NAME}
s3.getObject(params, function (err, data) {
    if (err) {
        console.log(err)
    }
    let image = new Buffer(data.Body).toString('base64');
    image = "data:"+data.ContentType+";base64,"+image;
    let response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': data.ContentType
        },
        "body":image,
        "isBase64Encoded": true
    };
    res.status(200).json({
        response
    })
});
})
router.get("/gettours",checkAuth,(req, res) => {
    console.log("sample",req.headers)
    res.status(200).json({
        status:"success",
        data:{
            user:tours
        }
    })
})

module.exports=router