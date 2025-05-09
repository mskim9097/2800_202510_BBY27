//logic related to common routes like login... goes here

const express = require('express');
const router  = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { database } = require('../utils/databaseConnection');
const speciesCollection = database.db('yourDBname').collection('species'); 

// show the “add species” form
router.get("/add-species", isAuthenticated, (req, res) => {
  res.render("add-species");
});

// handle the form POST
router.post("/add-species", isAuthenticated, async (req, res) => {
  const newSpecies = {
    commonName:     req.body.commonName,
    scientificName: req.body.scientificName,
    image:          req.body.image,
    description:    req.body.description,
    location: {
      center: {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng)
      },
      rangeKm: parseFloat(req.body.rangeKm)
    }
  };
  await speciesCollection.insertOne(newSpecies);
  res.redirect("/species");
});

// list all species
router.get("/species", isAuthenticated, async (req, res) => {
  const speciesList = await speciesCollection.find().toArray();
  res.render("pages/species", { species: speciesList });
});

module.exports = router;
