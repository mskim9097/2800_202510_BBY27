// researcher's specifc routes
const express = require('express');
const router = express.Router();
const {createQuest} = require('../controllers/researcherController');

router.get('/testQuest', (req, res) => {
    res.render('pages/testQuest');
})
router.get('/createQuest', createQuest);

module.exports = router;