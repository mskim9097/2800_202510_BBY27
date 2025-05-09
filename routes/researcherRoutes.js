// researcher's specifc routes
// explorer's specific routes
const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    // This will render views/pages/researcherDashboard.ejs
    res.render('pages/researcherDashboard2'); 
  });

  module.exports = router;