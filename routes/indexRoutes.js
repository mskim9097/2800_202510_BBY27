const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const router = express.Router();
const fs = require("fs");
const path = require("path");
const {signUp, destroySession, authenticateUser, authenticated} = require('../middleware/authentication');
const { database } = require('../databaseConnection');
const speciesCollection = database.db(process.env.MONGODB_DATABASE).collection('species');
const {isAuthorizedResearcher, isAuthorizedExplorer, checkAuthorization} = require('../middleware/authorization');

router.get('/', (req, res) => {
  res.render('pages/landing'); 
});

router.get('/signup', (req, res) => {
  res.render('pages/signup'); 
});

router.post('/createUser',signUp, async (req, res) => {
  res.redirect("/");
});

router.get('/login', (req, res) => {
  res.render('pages/login'); 
});

router.post('/login', authenticateUser, (req, res) => {
  res.redirect('/user');
});

router.get('/logout', destroySession, (req, res) => {
  res.redirect('/');
});

// list all species
router.get("/species",  async (req, res) => {
  try {
    const speciesList = await speciesCollection.find().toArray();
    res.render("pages/species", { species: speciesList, title: "All Species" });
  } catch (err) {
    console.error("Error fetching species list:", err);
    res.status(500).send("Error fetching species list");
  }
});

// Get a specific species by name
router.get("/species/:speciesName", async (req, res) => {
  try {
    const speciesName = req.params.speciesName;
    // Decode the speciesName in case it has URL encoded characters (e.g., spaces as %20)
    const decodedSpeciesName = decodeURIComponent(speciesName);
    const species = await speciesCollection.findOne({ speciesName: decodedSpeciesName });

    if (!species) {
      return res.status(404).render("pages/404", { title: "Not Found" }); // Assumes you have a 404.ejs page
    }
    res.render("pages/speciesDetail", { species: species, title: species.speciesName });
  } catch (err) {
    console.error("Error fetching species:", err);
    res.status(500).send("Error fetching species details");
  }
});

module.exports = router;
