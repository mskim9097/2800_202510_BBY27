const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const router = express.Router();


const {signUp} = require('../middleware/authentication');

router.get('/', (req, res) => {
  
  res.render('pages/landing'); 
});

router.get('/signup', (req, res) => {

  res.render('pages/signup'); 
});

router.post('/signup',signUp, async (req, res) => {

  res.redirect("/");
});

router.get('/login', (req, res) => {

  res.render('pages/login'); 
});



module.exports = router;
