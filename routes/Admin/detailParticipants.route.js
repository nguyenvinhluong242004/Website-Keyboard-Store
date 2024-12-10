const express = require("express");
const router = express.Router();
const controllerParticipants = require('../../app/controllers/Admin/participantsController.js');

router.get('/',controllerParticipants.showParticipants);

module.exports = router;