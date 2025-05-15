const express = require('express');
const router = express.Router();

const { isAuthorizedResearcher, isAuthorizedExplorer, checkAuthorization } = require('../middleware/authorization');
const { authenticated } = require('../middleware/authentication');

router.get('/', (req, res) => {
    checkAuthorization(req, res);
});

router.get('/explorer', authenticated, isAuthorizedExplorer, (req, res) => {
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