const express = require('express');

const router = express.Router();

const {
  authenticated,
  destroySession,
  authenticateUser,
  signUp,
  checkAuthorization,
  isAuthorizedResearcher,
} = require('../controllers/userController');

router.get('/', (req, res) => {
  res.render('pages/landing');
});

router.get('/signup', (req, res) => {
  res.render('pages/signup');
});

router.post('/createUser', signUp, async (req, res) => {
  res.redirect('/login');
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

router.get('/invalid', (req, res) => {
  res.render('pages/login', {
    error: 'Invalid email or password. Please try again.',
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

module.exports = router;
