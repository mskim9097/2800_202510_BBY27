const express = require('express');
const router = express.Router();

const {createSpecies, updateSpecies} = require('../controllers/researcherController');

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get('/add', (req, res) => {
    res.render('pages/addSpecies');
});

router.post('/add', upload.single("speciesImage"), createSpecies, (req, res) => {
    res.redirect("/researcher/dashboard");
});

router.post('/update', updateSpecies);


module.exports = router;

