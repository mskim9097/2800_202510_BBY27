// researcher's specifc routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {createQuest} = require('../controllers/researcherController');
const { addSpecies } = require("../controllers/userController");

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Optional: 10MB file size limit
});

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
    res.render('pages/addSpecies');
})

// show the "add species" form
router.post("/add-species", upload.single('speciesImage'), addSpecies);

module.exports = router;
