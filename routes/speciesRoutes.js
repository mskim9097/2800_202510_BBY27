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
router.get('/', authenticated, getSpecies, async (req, res) => {
  try {
    // The speciesList is now available from res.locals.speciesList set by getSpecies
    res.render('pages/speciesList', {
      speciesList: res.locals.speciesList,
      userType: req.session.type,
      error: null, // Error handling is now primarily in getSpecies
    });
  } catch (err) {
    // This catch block might still be useful for rendering errors
    // that occur after getSpecies but before or during rendering.
    res.render('pages/speciesList', {
      speciesList: [],
      userType: req.session.type,
      error:
        err.message ||
        'An unexpected error occurred while displaying the species list.',
    });
  }
});

// router.put('/species/:id', upload.single('image'), updateSpecies, (req, res) => {
//   console.log('Received update:', req.body);
//     console.log('Image:', req.file);
//   res.redirect(`/species/${req.params.id}`);
// });

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

// Get a specific species by name
// router.get('/:speciesName', async (req, res) => {
//   try {
//     const { speciesName } = req.params;
//     // Decode the speciesName in case it has URL encoded characters (e.g., spaces as %20)
//     const decodedSpeciesName = decodeURIComponent(speciesName);
//     const species = await speciesCollection.findOne({
//       speciesName: decodedSpeciesName,
//     });

//     if (!species) {
//       return res.status(404).render('pages/404', { title: 'Not Found' }); // Assumes you have a 404.ejs page
//     }
//     res.render('pages/speciesPage', {
//       species,
//       title: species.speciesName,
//       userType: req.session.type,
//       name: req.session.name,
//     });
//   } catch (err) {
//     console.error('Error fetching species:', err);
//     res.status(500).send('Error fetching species details');
//   }
// });

module.exports = router;
