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
  res.render('pages/signup', { error: null, formData: {} });
});

router.post('/createUser', signUp);

router.get('/login', (req, res) => {
  const { success } = req.query;
  res.render('pages/login', { error: null, success });
});

router.post('/login', authenticateUser);

router.get('/logout', destroySession);

router.get('/user', checkAuthorization);

router.get('/invalid', (req, res) => {
  res.render('pages/login', {
    error: 'Invalid email or password. Please try again.',
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

module.exports = router;
