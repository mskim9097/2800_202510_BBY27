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
  renderCreateQuestPage,
  getQuests,
  selectQuestList,
  selectQuest,
  updateQuest,
  deleteQuest,
  updateSighting,
} = require('../controllers/questsController');
const {
  isAuthorizedResearcher,
  authenticated,
} = require('../controllers/userController');

router.get('/', authenticated, getQuests);

router.get('/completeQuest', (req, res, next) => {
  res.redirect(researcherDashboard);
});

// NEEDS QUEST PAGE
router.get('/viewQuest', (req, res, next) => {
  res.redirect(researcherDashboard);
});

// Needs to be updated with actua
router.get(
  '/addQuest',
  authenticated,
  isAuthorizedResearcher,
  renderCreateQuestPage
);

router.get('/searchTarget', searchTarget);
router.get('/:id', selectQuest);

router.post(
  '/createQuest',
  isAuthorizedResearcher,
  createQuest,
  upload.single('speciesImage'),
  (req, res, next) => {
    res.redirect('/quests');
  }
);

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
  res.render('pages/sighting', { quest });
});
router.post(
  '/updateSighting/:id',
  upload.single('questImage'),
  updateSighting,
  (req, res) => {
    res.redirect(`/quests/${req.params.id}`);
  }
);

router.get('/updateQuest', isAuthorizedResearcher, (req, res, next) => {
  res.redirect(researcherDashboard);
});
router.post('/updateQuest', isAuthorizedResearcher, (req, res, next) => {
  res.redirect(researcherDashboard);
});

module.exports = router;
