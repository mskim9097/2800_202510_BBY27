const express = require('express');
const router = express.Router();
const { authenticated } = require('../controllers/userController');
const aiController = require('../controllers/aiController');

// All AI routes require authentication
router.use(authenticated);

router.get('/riddleForm', aiController.showRiddleForm);
router.post('/riddles', aiController.generateRiddles);
router.post('/riddles/grade', aiController.gradeRiddles);

module.exports = router;
