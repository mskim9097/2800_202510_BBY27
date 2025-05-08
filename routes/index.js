const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // This will render views/pages/landing.ejs
  res.render('pages/landing'); 
});

router.get('/signup', (req, res) => {
  // This will render views/pages/signup.ejs
  res.render('pages/signup'); 
});

router.get('/login', (req, res) => {
  // This will render views/pages/login.ejs
  res.render('pages/login'); 
});


module.exports = router;
