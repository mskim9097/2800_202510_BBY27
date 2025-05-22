const express = require('express');

const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/riddleForm', aiController.showRiddleForm);
router.post('/riddles', aiController.generateRiddles);
router.post('/riddles/grade', aiController.gradeRiddles);

module.exports = router;
