require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 12;

const cloudinary = require('cloudinary').v2;

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;

var { database } = include('databaseConnection');
const userCollection = database.db(mongodb_database).collection('user');
const speciesCollection = database.db(mongodb_database).collection('species');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Handle adding species
const addSpecies = async (req, res) => {
  try {
    let speciesImageUrl = null;

    // Check if a file was uploaded
    if (req.file) {
      // Upload image to Cloudinary from buffer
      // Giving it a unique public_id using field (e.g. speciesName if unique) and timestamp might be good
      // For simplicity, letting Cloudinary auto-generate public_id
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' }, // Can add folder: 'species_images' for organization
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      speciesImageUrl = result.secure_url;
    }

    const newSpecies = {
      speciesName: req.body.speciesName, // From form input name="speciesName"
      speciesScientificName: req.body.scientificName, // From form input name="scientificName"
      speciesImage: speciesImageUrl, // URL from Cloudinary or null
      speciesInfo: req.body.speciesInfo, // From form input name="speciesInfo"
    };

    await speciesCollection.insertOne(newSpecies);
    console.log('New species added to MongoDB:', newSpecies.speciesName);
    res.redirect("/species");

  } catch (error) {
    console.error("Error in addSpecies controller:", error);
    // Consider sending a user-friendly error page or message
    res.status(500).send("Error adding species. " + error.message);
  }
};

// sign up function.
const createUser = async (req, res) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var type = req.body.type;

  const schema = Joi.object({
    firstName: Joi.string().alphanum().max(20).required(),
    lastName: Joi.string().alphanum().max(20).required(),
    email: Joi.string().email().max(30).required(),
    password: Joi.string().max(20).required()
  });
  const validationResult = schema.validate({ firstName, lastName, email, password });
  /*
  if (validationResult.error != null) {
      res.send(`
          Invalid email/password combination.<br><br>
          <a href="/signup">Try again</a>
          `);
      return;
  }*/
  var hashedPassword = await bcrypt.hash(password, saltRounds);

  await userCollection.insertOne({ firstName: firstName, lastName: lastName, email: email, password: hashedPassword, type: type });

  res.redirect("/");
}

module.exports = { createUser , addSpecies };