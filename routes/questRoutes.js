const express = require('express');
const router = express.Router();

const { createQuest } = require('../controllers/questsController');

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const researcherDashboard = "/user/researcher";
const addQuest = "pages/addQuest";

const { isAuthorizedResearcher,authenticated } = require('../controllers/userController');

router.get('/completeQuest', (req, res, next) => {
    res.redirect(researcherDashboard);
});

// NEEDS QUEST PAGE
router.get('/viewQuest', (req, res, next) => {
    res.redirect(researcherDashboard);
});
// NEEDS QUEST LIST PAGE
router.get('/questList', (req, res, next) => {
    res.render("pages/quests");
});

//Needs to be updated with actua
router.get('/addQuest',authenticated, isAuthorizedResearcher, (req, res, next) => {
    res.render(addQuest);
});

// router.get('/searchTarget', searchTarget);

router.post('/addQuest', isAuthorizedResearcher, createQuest, (req, res, next) => {
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
