const express = require('express');
const router = express.Router();

const appClient = require('../databaseConnection').database;
const speciesCollection = appClient.db('biodiversityGo').collection('species');


const {  createSpecies, updateSpecies, deleteSpecies, getSpecies, targetSpecies, selectTarget , getSpeciesById } = require('../controllers/speciesController');
const { isAuthorizedResearcher, authenticated } = require('../controllers/userController');

const researcherDashboard = "/user/researcher";
const addSpecies = 'pages/addSpecies';
const update = 'pages/updateSpecies';
const species = 'pages/species';

// Multer configuration for memory storage
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// list all species
router.get("/",authenticated, getSpecies, async (req, res) => {
  try {
    // const speciesList = await speciesCollection.find().toArray();
    // res.render(species, { species: speciesList, title: "All Species" });
    console.log("User type from session:", req.session.type);
    res.render("pages/speciesList", { speciesList: res.locals.speciesList, userType: req.session.type });
  } catch (err) {
    console.error("Error fetching species list:", err);
    res.status(500).send("Error fetching species list");
  }
});

router.get("/:id", getSpeciesById);

router.put('/species/:id', upload.single('image'), updateSpecies, (req, res) => {
  res.redirect(`/species/${req.params.id}`);
});


router.get('/searchTarget', targetSpecies);

router.get('/selectTarget', selectTarget);

// router.get('/addSpecies', isAuthorizedResearcher, (req, res) => {
//   res.render(addSpecies);
// });

router.post('/addSpecies', isAuthorizedResearcher, upload.single("speciesImage"), createSpecies, (req, res) => {
    const speciesName = req.speciesName;
  res.redirect(`/species/${encodeURIComponent(speciesName)}`);
});

// NEED UPDATE SPECIES PAGE
// router.get('/updateSpecies', isAuthorizedResearcher, (req, res) => {
//   res.render(update);
// });

router.post('/updateSpecies/:id', isAuthorizedResearcher, upload.single("speciesImage"), updateSpecies, (req, res) => {
    const updatedName = req.body.speciesName;
    res.redirect(`/${encodeURIComponent(updatedName)}`);
});

router.delete('/:id', deleteSpecies, (req, res) => {
  res.redirect('/species'); // or homepage
});

// Get a specific species by name
router.get("/:speciesName", async (req, res) => {
    try {
        const speciesName = req.params.speciesName;
        // Decode the speciesName in case it has URL encoded characters (e.g., spaces as %20)
        const decodedSpeciesName = decodeURIComponent(speciesName);
        const species = await speciesCollection.findOne({ speciesName: decodedSpeciesName });

        if (!species) {
            return res.status(404).render("pages/404", { title: "Not Found" }); // Assumes you have a 404.ejs page
        }
        res.render("pages/speciesPage", { species: species, title: species.speciesName, userType: req.session.type, name: req.session.name });
    } catch (err) {
        console.error("Error fetching species:", err);
        res.status(500).send("Error fetching species details");
    }
});

module.exports = router;

