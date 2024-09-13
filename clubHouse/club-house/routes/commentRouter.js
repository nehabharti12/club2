var express = require("express");
var router = express.Router();
const commentController = require("../controller/commentController");
const jwtCheckMethod = require("../middleware/middlware");

router.post("/comment" ,jwtCheckMethod.authVerifyFunction, commentController.createComment);
router.put(
  "/markcomments/:videoId",jwtCheckMethod.authVerifyFunction,
  commentController.markCommentsAsReadByVideoId
);
router.get("/getComment/:videoId",jwtCheckMethod.authVerifyFunction, commentController.getComment);

module.exports = router;
