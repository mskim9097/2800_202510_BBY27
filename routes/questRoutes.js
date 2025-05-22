const express = require('express');
const Quest = require('../models/questModel');
const router = express.Router();

const multer = require('multer');

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const {
  createQuest,
  searchTarget,
  selectQuestList,
  selectQuest,
  updateQuest,
  deleteQuest,
  updateSighting
} = require('../controllers/questsController');
const {
  isAuthorizedResearcher,
  authenticated,
} = require('../controllers/userController');

// NEEDS QUEST LIST PAGE
// Quest List Page
router.get('/', selectQuestList, (req, res, next) => {
  // res.redirect(researcherDashboard);
  res.render('pages/questList', {
    userType: req.session.type,
    name: req.session.name,
  });
});
router.get('/completeQuest', (req, res, next) => {
  res.redirect(researcherDashboard);
});

router.get('/addQuest', authenticated, isAuthorizedResearcher, (req, res, next) => {
    res.render('pages/addQuest');
});

router.get('/searchTarget', searchTarget);
router.get('/:id', selectQuest);

// NEEDS QUEST PAGE
router.get('/viewQuest', (req, res, next) => {
  res.redirect(researcherDashboard);
});
// NEEDS QUEST LIST PAGE
router.get('/questList', (req, res, next) => {
  res.render('pages/questList');
});

router.post('/createQuest', isAuthorizedResearcher, upload.single('speciesImage'), createQuest);

router.post(
  '/updateQuest/:id',
  isAuthorizedResearcher,
  updateQuest,
  (req, res) => {
    res.redirect(`/quests/${req.params.id}`);
  }
);

router.post('/deleteQuest/:id', deleteQuest, (req, res) => {
  res.redirect('/quests');
});

router.get('/sighting/:id', async (req, res) => {
  const quest = await Quest.findById(req.params.id);
  res.render("pages/sighting", {quest});
})
router.post('/updateSighting/:id', upload.single("questImage"), updateSighting, (req, res) => {
  res.redirect(`/quests/${req.params.id}`);
});

//! !!! NEEDS MIDDLEWARE FOR UPDATING QUESTS !!!!!
router.get('/updateQuest', isAuthorizedResearcher, (req, res, next) => {
  // NEEDS PAGE FOR UPDATING QUESTS
  res.redirect(researcherDashboard);
});
router.post('/updateQuest', isAuthorizedResearcher, (req, res, next) => {
  res.redirect(researcherDashboard);
});



module.exports = router;
