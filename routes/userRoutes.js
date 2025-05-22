const express = require('express');

const router = express.Router();

const { authenticated, destroySession, authenticateUser, signUp, checkAuthorization, isAuthorizedResearcher, isAuthorizedExplorer } = require('../controllers/userController');
const { getResearcherDashboard, getExplorerDashboard } = require("../controllers/questsController");

router.get('/', (req, res) => {
  checkAuthorization(req, res);
});

router.get('/explorer', authenticated, getExplorerDashboard);

router.get('/researcher', authenticated, isAuthorizedResearcher, getResearcherDashboard);

module.exports = router;
