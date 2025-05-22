const Species = require('../models/specieModel');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;

const appClient = require('../databaseConnection').database;

const speciesCollection = appClient.db('biodiversityGo').collection('species');

/**
 * Configures the Cloudinary SDK with credentials from environment variables.
 * This setup is essential for enabling image upload and management functionalities
 * provided by Cloudinary within the application.
 * @author https://chat.openai.com/ (Chat GPT Gemini 2.5-pro)
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

const getSpecies = async (req, res, next) => {
  try {
    const speciesList = await Species.find();
    // Attach the species list to `res.locals` to pass to the route/render layer
    res.locals.speciesList = speciesList;
    next();
  } catch (err) {
    console.error('Error fetching species list:', err);
    res.status(500).send('Error fetching species list');
  }
};

const createSpecies = async (req, res, next) => {
  try {
    const {
      speciesScientificName,
      speciesName,
      speciesInfo,
      speciesHabitat,
      speciesType,
    } = req.body;

    const speciesImage = [];
    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer);
      speciesImage.push(imageUrl);
    }
    const createdBy = req.session.userId;
    const newSpecies = new Species({
      speciesScientificName,
      speciesName,
      speciesInfo,
      speciesImage,
      speciesHabitat,
      speciesType,
      createdBy,
    });

    await newSpecies.save();
    req.speciesName = speciesName;
    next(); // or res.status(201).json(newSpecies);
  } catch (error) {
    console.error('Error creating species:', error);
    res.status(500).send(`Error adding species. ${error.message}`);
  }
};

const updateSpecies = async (req, res, next) => {
  const speciesId = req.params.id;
  const {
    speciesName,
    speciesScientificName,
    speciesHabitat,
    speciesType,
    speciesInfo,
  } = req.body;

  const speciesImageUrl = await addImage(req, res, next);

  const updateFields = {
    speciesName,
    speciesScientificName,
    speciesHabitat,
    speciesType,
    speciesInfo,
  };

  if (speciesImageUrl) {
    updateFields.speciesImage = speciesImageUrl;
  }

  await speciesCollection.updateOne(
    { _id: new ObjectId(speciesId) },
    { $set: updateFields }
  );
  next();
};

const targetSpecies = async (req, res) => {
  const speciesScientificName = req.query.q;

  console.log('getSpecies');

  if (!speciesScientificName) {
    return res.status(400).json({ error: 'Missing query' });
  }

  const species = await speciesCollection.findOne({ speciesScientificName });

  if (species) {
    res.status(200).json([species]); // return as array for consistency with frontend
  } else {
    res.json([]); // return empty array if no match
  }
};

// Helper function that handles image upload to Cloudinary.
const addImage = async (req, res, next) => {
  let speciesImageUrl = null;

  // Check if a file was uploaded
  if (req.file) {
    // Upload image to Cloudinary from buffer
    // For simplicity, Cloudinary auto-generate public_id
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
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
    return speciesImageUrl;
  }
};

// DeleteFunction that deletes species data in mongoDB.
const deleteSpecies = async (req, res, next) => {
  const speciesId = req.params.id;
  const objectId = new ObjectId(speciesId);
  const species = await speciesCollection.findOne({ _id: objectId });
  if (species) {
    await speciesCollection.deleteOne({ _id: objectId });
  }
  next();
};

const selectTarget = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing species ID' });

  try {
    const species = await speciesCollection.findOne({ _id: new ObjectId(id) });
    if (!species) return res.status(404).json({ error: 'Species not found' });
    res.json(species);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createSpecies,
  updateSpecies,
  targetSpecies,
  deleteSpecies,
  getSpecies,
  selectTarget,
};
