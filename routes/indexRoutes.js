const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const router = express.Router();


const {signUp, destroySession, authenticateUser, authenticated} = require('../middleware/authentication');

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

router.post('/login', authenticateUser, (req, res) => {
  res.redirect('/user');
});

router.get('/logout', destroySession, (req, res) => {
  res.redirect('/');
});

module.exports = router;
