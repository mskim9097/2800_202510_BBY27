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

// This is test page for main <<
router.get('/test-main', async (req, res) => {
  const result = await userCollection.find({email: 'mskim9097@gmail.com'}).project({email: 1, type: 1, _id: 1}).toArray();
  req.session.authenticated = true;
	req.session.username = username;
  req.session.type = result[0].type;
  res.render('pages/test-main', {type: type});
});

module.exports = router;
