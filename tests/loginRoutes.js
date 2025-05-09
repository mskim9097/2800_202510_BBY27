const express = require('express');
const router = express.Router();

const app = express();
app.set('view engine', 'ejs');

// const {} = require('authorization');

const { authenticated, destroySession, createSession, authenticateUser } = require('../middleware/authentication');

// router.use(authenticated);

router.get('/login', (req, res) => {
  // This will render views/pages/landing.ejs
  res.render('pages/login'); 
});

router.post('/login', authenticateUser, authenticated, (req, res) => {
  // This will render views/pages/landing.ejs
  res.render('tests/blair_test'); 
});

module.exports = router;