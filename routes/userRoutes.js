const express = require('express');

const router = express.Router();

const { authenticated, destroySession, authenticateUser, signUp, checkAuthorization, isAuthorizedResearcher,isAuthorizedExplorer } = require('../controllers/userController');
const {getResearcherDashboard} = require("../controllers/questsController");

router.get('/', (req, res) => {
  checkAuthorization(req, res);
});

router.get('/explorer', authenticated, (req, res) => {
  res.render('pages/explorerDashboard');
});

router.get('/researcher', authenticated, isAuthorizedResearcher,getResearcherDashboard);

module.exports = router;
