var express = require("express");
var router = express.Router();
const clubController = require("../controller/clubController");
const jwtCheckMethod = require("../middleware/middlware");

router.post("/createClub", jwtCheckMethod.authVerifyFunction,jwtCheckMethod.authVerifySuperAdmin,clubController.createClub);
router.get("/getClubById/:id",jwtCheckMethod.authVerifyFunction, clubController.getClubById);
router.post("/updateClub/:id",jwtCheckMethod.authVerifyFunction, clubController.updateClubById);
router.delete("/deleteClubById/:id", clubController.deleteClubById);
router.get("/getAllRoles",jwtCheckMethod.authVerifyFunction,clubController.getAllRoles)
router.post("/inviteUser", clubController.InviteUser);
router.get("/verifyInviteLink", clubController.verifyInviteUserLink);
router.put("/updatePassword", clubController.clubMemeberUpdatePassword);
router.get("/getAllClub",jwtCheckMethod.authVerifyFunction,jwtCheckMethod.authVerifySuperAdmin,clubController.getAllClub)


module.exports = router;
