const express = require('express');
const router = express.Router();

const appClient = require('../databaseConnection').database;
const speciesCollection = appClient.db('biodiversityGo').collection('species');


const {createSpecies, updateSpecies, deleteSpecies,getSpecies} = require('../controllers/speciesController');
const { isAuthorizedResearcher,authenticated } = require('../controllers/userController');

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


// // Get a specific species by name
// router.get("/:speciesName", async (req, res) => {
//   try {
//     const speciesName = req.params.speciesName;
//     // Decode the speciesName in case it has URL encoded characters (e.g., spaces as %20)
//     const decodedSpeciesName = decodeURIComponent(speciesName);
//     const species = await speciesCollection.findOne({ speciesName: decodedSpeciesName });

//     if (!species) {
//       return res.status(404).render("pages/404", { title: "Not Found" }); // Assumes you have a 404.ejs page
//     }
//     res.render("pages/speciesDetail", { species: species, title: species.speciesName });
//   } catch (err) {
//     console.error("Error fetching species:", err);
//     res.status(500).send("Error fetching species details");
//   }
// });

router.get("/",getSpecies,(req,res)=>{
  res.render("pages/species",{ species: res.locals.speciesList});
})

router.get('/addSpecies', isAuthorizedResearcher, (req, res) => {
    res.render(addSpecies);
});

router.post('/addSpecies', isAuthorizedResearcher, upload.single("speciesImage"), createSpecies, (req, res) => {
    res.redirect(researcherDashboard);
});

// NEED UPDATE SPECIES PAGE
router.get('/updateSpecies', isAuthorizedResearcher, (req, res) => {
    res.render(update);
});

router.post('/updateSpecies', isAuthorizedResearcher, upload.single("speciesImage"), updateSpecies, (req, res) => {
    res.redirect(researcherDashboard);
});

router.post('/deleteSpecies', isAuthorizedResearcher, deleteSpecies, (req, res) => {
    res.redirect(researcherDashboard);
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
    res.render("pages/speciesPage", { species: species, title: species.speciesName });
  } catch (err) {
    console.error("Error fetching species:", err);
    res.status(500).send("Error fetching species details");
  }
});

module.exports = router;

