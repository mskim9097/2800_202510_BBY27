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
    res.render('tests/explorer');
});

router.get('/researcher', authenticated, isAuthorizedResearcher, (req, res) => {
    /*
    Needs to be changed to the correct route (the researcher dashboard)
    */
    res.render('tests/researcher');
});

router.post('/logout', (req, res) => {
    res.redirect('/logout');
});

module.exports = router;