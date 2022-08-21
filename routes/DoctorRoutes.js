const express=require('express')
const {DoctorsController,GetAllDoctorController,uploadUserPhoto,doctorUpdate,doctorDelete}=require('../Controllers/DoctorController')
const {ProtectedRoute}=require("../Controllers/userContoller")
const router=express.Router()
router.route("/doctorAdd").post(ProtectedRoute,uploadUserPhoto,DoctorsController)
router.route("/getDoctor").get(ProtectedRoute,GetAllDoctorController)
router.route("/doctorUpdate/:id").patch(ProtectedRoute,doctorUpdate)
router.route("/doctorDelete/:id").delete(ProtectedRoute,doctorDelete)
module.exports=router