const express = require('express');
const router = express.Router();

const { authenticated, destroySession, authenticateUser, signUp, checkAuthorization, isAuthorizedResearcher,isAuthorizedExplorer } = require('../controllers/userController');

router.get('/', (req, res) => {
    checkAuthorization(req, res);
});

router.get('/explorer', authenticated, (req, res) => {

    res.render('pages/explorerDashboard', { name: req.session.name });
});

router.get('/researcher', authenticated, isAuthorizedResearcher, (req, res) => {

    res.render('pages/researcherDashboard', { name: req.session.name });
});

module.exports = router;