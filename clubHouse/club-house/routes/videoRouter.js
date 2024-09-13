var express = require("express");
var router = express.Router();
const jwtCheckMethod = require("../middleware/middlware");
const videoController = require("../controller/videoController");

router.post("/upload/videos",jwtCheckMethod.authVerifyFunction,jwtCheckMethod.authVerifyStudent, videoController.createVideoRecord);
router.post("/generatePresignedUrl",jwtCheckMethod.authVerifyFunction, videoController.generatePresignedUrl);
router.get("/getAllVideos",jwtCheckMethod.authVerifyFunction, videoController.getAllVideosByCurrentUser);
router.put("/updateVideo/:videoId", videoController.updateVideo);

module.exports = router;
