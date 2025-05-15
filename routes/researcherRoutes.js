// researcher's specifc routes
const express = require('express');
const router = express.Router();
const {createQuest} = require('../controllers/researcherController');

router.get('/dashboard', (req, res) => {
    // This will render views/pages/researcherDashboard.ejs
    res.render('pages/researcherDashboard'); 
});

router.get('/testQuest', (req, res) => {
    res.render('pages/testQuest');
});

router.get("/add-quest", (req, res) => {
    res.render("pages/addQuest");
});

router.get('/createQuest', createQuest);

module.exports = router;
