const express=require('express')
const {SignUpControll,LoginControll,ProtectedRoute,getAllUser,refreshController}=require('../Controllers/userContoller')
const router=express.Router()
router.route('/signup').post(SignUpControll)
router.route("/login").post(LoginControll)
router.route("/getAllUser").get(ProtectedRoute,getAllUser)
router.route("/refresh").post(refreshController)
module.exports=router
