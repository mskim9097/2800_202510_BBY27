const express = require('express');

const router = express.Router();

<<<<<<< HEAD
const { authenticated, destroySession, authenticateUser, signUp, checkAuthorization, isAuthorizedResearcher,isAuthorizedExplorer } = require('../controllers/userController');
const {getResearcherDashboard} = require("../controllers/questsController");
=======
const {
  authenticated,
  destroySession,
  authenticateUser,
  signUp,
  checkAuthorization,
  isAuthorizedResearcher,
  isAuthorizedExplorer,
} = require('../controllers/userController');
>>>>>>> 395379d78488e37492e2488aa66443e1708cdd7a

router.get('/', (req, res) => {
  checkAuthorization(req, res);
});

router.get('/explorer', authenticated, (req, res) => {
  res.render('pages/explorerDashboard');
});

<<<<<<< HEAD
router.get('/researcher', authenticated, isAuthorizedResearcher,getResearcherDashboard);
=======
router.get('/researcher', authenticated, isAuthorizedResearcher, (req, res) => {
  res.render('pages/researcherDashboard');
});
>>>>>>> 395379d78488e37492e2488aa66443e1708cdd7a

module.exports = router;
