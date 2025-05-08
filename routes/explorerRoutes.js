// explorer's specific routes
const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    // This will render views/pages/explorerDashboard.ejs
    res.render('pages/explorerDashboard'); 
  });

  module.exports = router;