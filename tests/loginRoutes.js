const express = require('express');
const router = express.Router();

const app = express();
app.set('view engine', 'ejs');


const { authenticated, destroySession, createSession, authenticateUser } = require('../middleware/authentication');

router.get('/', (req, res) => {
  // This will render views/pages/landing.ejs
  res.render('tests/blair_test'); 
});

module.exports = router;