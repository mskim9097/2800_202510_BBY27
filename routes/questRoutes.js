const express = require('express');
const router = express.Router();

const {createSpecies, updateSpecies, createQuest} = require('../controllers/researcherController');

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//Needs to be updated with actua
router.get('/createQuest', (req, res, next) => {
    res.render('pages/addQuest');
});

router.post('/createQuest', upload.single("speciesImage"), createQuest, (req, res, next) => {
    res.redirect("/researcher/dashboard");
});

//!!!! NEEDS MIDDLEWARE FOR UPDATING QUESTS !!!!!
router.get('/update', (req, res, next) => {
    // NEEDS PAGE FOR UPDATING QUESTS
    res.redirect("/researcher/dashboard");
});
router.post('/update', (req, res, next) => {
    res.redirect("/researcher/dashboard");
});

module.exports = router;
