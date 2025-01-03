const express = require("express");
const router = express.Router();
const controllerParticipants = require('../../app/controllers/Admin/participantsController.js');

router.get('/',controllerParticipants.showParticipants);
router.put('/update/:id',controllerParticipants.deleteForm);
router.put('/close/:id',controllerParticipants.closeForm);
router.get('/api',controllerParticipants.getGroupBy);
router.get('/api/register',controllerParticipants.getRegister);
router.get('/api/detailRegister',controllerParticipants.getDetailRegister);
router.get('/api/exportRegister',controllerParticipants.getRegisterExport);
router.get('/api/searchRegister',controllerParticipants.getRegisterSearch);

module.exports = router;