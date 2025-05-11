const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const router = express.Router();
const speciesList = require("../dummy_species.json");
const fs = require("fs");
const path = require("path");
const {signUp, destroySession, authenticateUser, authenticated} = require('../middleware/authentication');

router.get('/', (req, res) => {
  res.render('pages/landing'); 
});

router.get('/signup', (req, res) => {
  res.render('pages/signup'); 
});

router.post('/signup',signUp, async (req, res) => {
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
  const file = path.join(__dirname, "../dummy_species.json");
  const speciesList = JSON.parse(fs.readFileSync(file, "utf8"));
  //this line is for later when u connect to the database
  // const speciesList = await speciesCollection.find().toArray();
  res.render("pages/species", { species: speciesList });
});

module.exports = router;
