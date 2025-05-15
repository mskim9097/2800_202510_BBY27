const express = require('express');
const router = express.Router();

const { authenticated, destroySession, authenticateUser, signUp, checkAuthorization, isAuthorizedResearcher } = require('../controllers/userController');

router.get('/', (req, res) => {
    checkAuthorization(req, res);
});

router.get('/explorer', authenticated, (req, res) => {
    /*
    Needs to be changed to the correct route (the explorer dashboard)
    */
    res.render('pages/explorerDashboard');
});

router.get('/researcher', authenticated, isAuthorizedResearcher, (req, res) => {
    /*
    Needs to be changed to the correct route (the researcher dashboard)
    */
    res.render('pages/researcherDashboard');
});

module.exports = router;