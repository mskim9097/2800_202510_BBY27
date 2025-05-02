const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // This will render views/pages/home.ejs
  res.render('pages/home'); 
});

module.exports = router;
