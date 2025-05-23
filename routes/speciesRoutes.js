const express = require('express');

const router = express.Router();

const multer = require('multer');
const appClient = require('../databaseConnection').database;

const speciesCollection = appClient.db('biodiversityGo').collection('species');

const {
  createSpecies,
  updateSpecies,
  deleteSpecies,
  getSpecies,
  targetSpecies,
  selectTarget,
  getSpeciesById,
} = require('../controllers/speciesController');
const {
  isAuthorizedResearcher,
  authenticated,
} = require('../controllers/userController');

const researcherDashboard = '/user/researcher';
const addSpecies = 'pages/addSpecies';
const update = 'pages/updateSpecies';
const species = 'pages/species';

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// list all species
router.get('/', authenticated, getSpecies);

router.get('/searchTarget', targetSpecies);

router.get('/selectTarget', selectTarget);

router.get('/addSpecies', isAuthorizedResearcher, (req, res) => {
  res.render(addSpecies);
});

router.post(
  '/addSpecies',
  isAuthorizedResearcher,
  upload.single('speciesImage'),
  createSpecies,
  (req, res) => {
    res.redirect(`/species/${req.newSpecies._id}`);
  }
);

router.get('/:id', getSpeciesById);

router.post(
  '/updateSpecies/:id',
  isAuthorizedResearcher,
  upload.single('speciesImage'),
  updateSpecies,
  (req, res) => {
    res.redirect(`/species/${req.params.id}`);
  }
);

router.post('/:id', deleteSpecies, (req, res) => {
  res.redirect('/species');
});

module.exports = router;
