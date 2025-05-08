const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // This will render views/pages/home.ejs
  res.render('pages/landing'); 
});

router.get('/sign_in', (req, res) => {
  res.render('pages/login');
});


module.exports = router;
