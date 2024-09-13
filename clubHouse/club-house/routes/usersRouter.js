var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');
const jwtCheckMethod = require('../middleware/middlware');
const clubController = require('../controller/clubController');

router.post("/signup",userController.createUser)
router.post("/login",userController.login);
router.get("/getCurrentUser",jwtCheckMethod.authVerifyFunction,userController.getCurrentUser);
router.post("/forgotPassword",userController.forgotPassword);
router.post("/resetPassword",jwtCheckMethod.authVerifyFunction,userController.resetPassword);
router.post("/updatePassword",jwtCheckMethod.authVerifyFunction,userController.updatePassword);
router.get("/getUserById/:id",jwtCheckMethod.authVerifyFunction,userController.getUserById);















module.exports = router;
