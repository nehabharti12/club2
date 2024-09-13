var express = require('express');
var router = express.Router();
const coachController = require('../controller/coachController');

router.post("/createCoach",coachController.createCoach);
router.get("/getCoach/:clubId",coachController.getCoachWithClubId);
router.get("/getCoach/:coachId",coachController.getCoachWithId);





module.exports = router