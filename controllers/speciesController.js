const Species = require('../models/specieModel');
require('dotenv').config();
const mongoose = require('mongoose');
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

const getSpecies = async (req, res) => {
  try {
    const speciesList = await Species.find().sort({ speciesName: 1 });
    res.render('pages/speciesList', {
      speciesList,
      userType: req.session.type,
      error: null,
    });
  } catch (err) {
    res.render('pages/speciesList', {
      speciesList: [],
      userType: req.session.type,
      error: 'Unable to retrieve the species list. Please try again later.',
    });
  }
};

const getSpeciesById = async (req, res, next) => {
  try {
    const speciesId = req.params.id;
    const species = await Species.findById(speciesId);

    if (!species) {
      const error = new Error(
        'The species you are looking for could not be found.'
      );
      error.status = 404;
      throw error;
    }

    res.render('pages/speciesPage', {
      species,
      userType: req.session?.type,
      name: req.session?.name,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid species ID format.');
      castError.status = 400;
      next(castError);
    } else {
      next(error);
    }
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

    if (!speciesName || !speciesScientificName) {
      const error = new Error(
        'Please provide both the common name and scientific name for the species.'
      );
      error.name = 'ValidationError';
      throw error;
    }

    const speciesImage = [];
    if (req.file) {
      try {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        speciesImage.push(imageUrl);
      } catch (uploadError) {
        const error = new Error(
          'Failed to upload the species image. Please try again.'
        );
        error.status = 500;
        throw error;
      }
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
    req.newSpecies = newSpecies;
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(error.errors).map((err) => err.message);
      const validationError = new Error(
        `Please check the following: ${messages.join(', ')}`
      );
      validationError.name = 'ValidationError';
      next(validationError);
    } else {
      const serverError = new Error(
        'Failed to create the species. Please try again later.'
      );
      serverError.status = 500;
      next(serverError);
    }
  }
};

const updateSpecies = async (req, res, next) => {
  try {
    const speciesId = req.params.id;
    const {
      speciesName,
      speciesScientificName,
      speciesHabitat,
      speciesType,
      speciesInfo,
    } = req.body;

    const species = await Species.findById(speciesId);
    if (!species) {
      const error = new Error(
        'The species you are trying to update could not be found.'
      );
      error.status = 404;
      throw error;
    }

    let speciesImageUrl;
    if (req.file) {
      try {
        speciesImageUrl = await addImage(req, res, next);
      } catch (uploadError) {
        const error = new Error(
          'Failed to upload the new species image. Please try again.'
        );
        error.status = 500;
        throw error;
      }
    }

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

    const updatedSpecies = await Species.findByIdAndUpdate(
      speciesId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedSpecies) {
      const error = new Error(
        'Failed to update the species. The species may have been deleted.'
      );
      error.status = 404;
      throw error;
    }

    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(error.errors).map((err) => err.message);
      const validationError = new Error(
        `Please check the following: ${messages.join(', ')}`
      );
      validationError.name = 'ValidationError';
      next(validationError);
    } else if (error.name === 'CastError') {
      const castError = new Error('Invalid species ID format.');
      castError.status = 400;
      next(castError);
    } else {
      next(error);
    }
  }
};

const deleteSpecies = async (req, res, next) => {
  try {
    const speciesId = req.params.id;
    const deletedSpecies = await Species.findByIdAndDelete(speciesId);

    if (!deletedSpecies) {
      const error = new Error(
        'The species you are trying to delete could not be found.'
      );
      error.status = 404;
      throw error;
    }

    next();
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid species ID format.');
      castError.status = 400;
      next(castError);
    } else {
      const serverError = new Error(
        'Failed to delete the species. Please try again later.'
      );
      serverError.status = 500;
      next(serverError);
    }
  }
};

const targetSpecies = async (req, res, next) => {
  try {
    const speciesScientificName = req.query.q;

    if (!speciesScientificName) {
      const error = new Error(
        'Please provide a scientific name to search for.'
      );
      error.name = 'ValidationError';
      throw error;
    }

    const species = await Species.findOne({ speciesScientificName });
    res.json(species ? [species] : []);
  } catch (error) {
    const serverError = new Error(
      'Failed to search for the species. Please try again later.'
    );
    serverError.status = 500;
    next(serverError);
  }
};

const selectTarget = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const error = new Error('Please provide a species ID to select.');
      error.name = 'ValidationError';
      throw error;
    }

    const species = await Species.findById(id);

    if (!species) {
      const error = new Error('The selected species could not be found.');
      error.status = 404;
      throw error;
    }

    res.json(species);
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid species ID format.');
      castError.status = 400;
      next(castError);
    } else {
      const serverError = new Error(
        'Failed to select the species. Please try again later.'
      );
      serverError.status = 500;
      next(serverError);
    }
  }
};

module.exports = {
  createSpecies,
  updateSpecies,
  deleteSpecies,
  getSpecies,
  targetSpecies,
  selectTarget,
  getSpeciesById,
};
