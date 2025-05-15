const express = require('express');
const router = express.Router();

const { authenticated, destroySession, authenticateUser, signUp, checkAuthorization, isAuthorizedResearcher,isAuthorizedExplorer } = require('../controllers/userController');

router.get('/', (req, res) => {
    checkAuthorization(req, res);
});

router.get('/explorer', authenticated,isAuthorizedExplorer, (req, res) => {

    res.render('pages/explorerDashboard');
});

router.get('/researcher', authenticated, isAuthorizedResearcher, (req, res) => {

    res.render('pages/researcherDashboard');
});

module.exports = router;