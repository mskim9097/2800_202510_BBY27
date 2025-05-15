const express = require('express');
const router = express.Router();

const {createSpecies, updateSpecies} = require('../controllers/researcherController');

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get('/addSpecies', (req, res) => {
    res.render('pages/addSpecies');
});

router.post('/addSpecies', upload.single("speciesImage"), createSpecies, (req, res) => {
    res.redirect("/researcher/dashboard");
});

// NEED UPDATE SPECIES PAGE
router.get('/updateSpecies', (req, res) => {
    res.render('pages/updateSpecies');
});

router.post('/updateSpecies', upload.single("speciesImage"), createSpecies, (req, res) => {
    res.redirect("/researcher/dashboard");
});

router.post('/updateSpecies', updateSpecies);


module.exports = router;

