// researcher's specifc routes
const express = require('express');
const router = express.Router();
const {createQuest} = require('../controllers/researcherController');
const { addSpecies } = require("../controllers/userController");
router.get('/dashboard', (req, res) => {
    // This will render views/pages/researcherDashboard.ejs
    res.render('pages/researcherDashboard2'); 
});


router.get('/testQuest', (req, res) => {
    res.render('pages/testQuest');
})
router.get("/add-quest", (req, res) => {
    res.render("pages/addQuest");
});

router.get('/createQuest', createQuest);

router.get("/add-species",(req, res) => {
    res.render('pages/species-add');
})

// show the “add species” form
router.post("/add-species", addSpecies);

module.exports = router;
