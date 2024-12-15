const express = require("express");
const router = express.Router();
const controllerParticipants = require('../../app/controllers/Admin/participantsController.js');

router.get('/',controllerParticipants.showParticipants);
router.get('/api',controllerParticipants.getGroupBy);
router.get('/api/register',controllerParticipants.getRegister);
router.get('/api/detailRegister',controllerParticipants.getDetailRegister);
router.get('/api/exportRegister',controllerParticipants.getRegisterExport);

module.exports = router;