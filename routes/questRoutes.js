const express = require('express');
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const researcherDashboard = "/user/researcher";
const addQuest = "pages/addQuest";

const { createQuest, searchTarget,renderCreateQuestPage,getQuests } = require('../controllers/questsController');
const { isAuthorizedResearcher,authenticated } = require('../controllers/userController');

// NEEDS QUEST LIST PAGE
// Quest List Page
// router.get('/', selectQuestList, (req, res, next) => {
//     // res.redirect(researcherDashboard);
//     res.render('pages/questList', {userType: req.session.type, name: req.session.name});
// });

router.get('/',authenticated,getQuests);

router.get('/completeQuest', (req, res, next) => {
    res.redirect(researcherDashboard);
});

// NEEDS QUEST PAGE
router.get('/viewQuest', (req, res, next) => {
    res.redirect(researcherDashboard);
});

//Needs to be updated with actua
router.get('/addQuest',authenticated, isAuthorizedResearcher,renderCreateQuestPage);

router.get('/searchTarget', searchTarget);

router.post('/createQuest', isAuthorizedResearcher,createQuest, upload.single("speciesImage"),(req, res, next) => {
    res.redirect('/quests');
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
