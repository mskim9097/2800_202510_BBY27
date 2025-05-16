const express = require('express');
const router = express.Router();

const { createQuest } = require('../controllers/questsController');

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const researcherDashboard = "/user/researcher";
const addQuest = "pages/addQuest";

const { isAuthorizedResearcher } = require('../controllers/userController');
const { searchTarget } = require('../controllers/questsController');

// NEEDS QUEST LIST PAGE
// Quest List Page
router.get('/', (req, res, next) => {
    // res.redirect(researcherDashboard);
    res.render('pages/testQuest');
});
router.get('/completeQuest', (req, res, next) => {
    res.redirect(researcherDashboard);
});

// NEEDS QUEST PAGE
router.get('/viewQuest', (req, res, next) => {
    res.redirect(researcherDashboard);
});

//Needs to be updated with actua
router.get('/addQuest', isAuthorizedResearcher, (req, res, next) => {
    res.render(addQuest);
});

router.get('/searchTarget', searchTarget);

router.post('/addQuest', isAuthorizedResearcher, upload.single("speciesImage"), createQuest, (req, res, next) => {
    res.redirect(researcherDashboard);
});

//!!!! NEEDS MIDDLEWARE FOR UPDATING QUESTS !!!!!
router.get('/updateQuest', isAuthorizedResearcher, (req, res, next) => {
    // NEEDS PAGE FOR UPDATING QUESTS
    res.redirect(researcherDashboard);
});
router.post('/updateQuest', isAuthorizedResearcher, (req, res, next) => {
    res.redirect(researcherDashboard);
});


module.exports = router;
