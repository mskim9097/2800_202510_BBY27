require('dotenv').config();
const express = require('express');
const Joi = require('joi');
const Quest = require('../models/questModel');
const Species = require('../models/specieModel');
const cloudinary = require('cloudinary').v2;

const appClient = require('../databaseConnection').database;

const speciesCollection = appClient.db('biodiversityGo').collection('species');
const questCollection = appClient.db('biodiversityGo').collection('quests');
const { ObjectId } = require('mongodb');

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

// searchTarget function to search spicies that match input from mongoDB
const searchTarget = async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.json([]);

  const results = await speciesCollection
    .find({ speciesName: { $regex: keyword, $options: 'i' } })
    .limit(5)
    .toArray();
  res.json(results);
};

const selectQuestList = async (req, res) => {
  try {
    let questList;

    if (req.session.type === 'researcher') {
      const { userId } = req.session;
      questList = await Quest.find({ questCreatedBy: userId }).sort({
        createdAt: -1,
      });
    } else {
      questList = await Quest.find().sort({ createdAt: -1 });
    }

    res.render('pages/questList', {
      questList,
      userType: req.session.type,
      error: null,
    });
  } catch (err) {
    res.render('pages/questList', {
      questList: [],
      userType: req.session.type,
      error: 'Unable to retrieve the quest list. Please try again later.',
    });
  }
};

// select specific quest
const selectQuest = async (req, res) => {
  try {
    const questId = req.params.id;
    const quest = await Quest.findById(questId);
    const { userId } = req.session;

    if (!quest) {
      return res.render('pages/quest', {
        quest: null,
        species: null,
        userId,
        userType: req.session?.type,
        name: req.session?.name,
        error: 'The quest you are looking for could not be found.',
      });
    }

    const species = await Species.findById(quest.speciesId);
    if (!species) {
      return res.render('pages/quest', {
        quest,
        species: null,
        userId,
        userType: req.session?.type,
        name: req.session?.name,
        error: 'The species associated with this quest could not be found.',
      });
    }

    res.render('pages/quest', {
      quest,
      species,
      userId,
      userType: req.session?.type,
      name: req.session?.name,
      error: null,
    });
  } catch (error) {
    res.render('pages/quest', {
      quest: null,
      species: null,
      userId: req.session.userId,
      userType: req.session?.type,
      name: req.session?.name,
      error: 'Unable to retrieve the quest details. Please try again later.',
    });
  }
};

const renderCreateQuestPage = async (req, res) => {
  try {
    const speciesList = await Species.find({});
    res.render('pages/addQuest', {
      speciesList,
      userType: req.session?.type,
      name: req.session?.name,
      error: null,
    });
  } catch (err) {
    res.render('pages/addQuest', {
      speciesList: [],
      userType: req.session?.type,
      name: req.session?.name,
      error: 'Unable to load the species list. Please try again later.',
    });
  }
};

const createQuest = async (req, res) => {
  try {
    const speciesList = await Species.find({});
    const {
      title: questTitle,
      mission: questMission,
      latitude,
      longitude,
      target,
      timeOfDay: questTimeOfDay,
      difficulty: questDifficulty,
    } = req.body;

    // Validation checks
    if (
      !questTitle ||
      !questMission ||
      !target ||
      !questTimeOfDay ||
      !questDifficulty
    ) {
      return res.render('pages/addQuest', {
        speciesList,
        userType: req.session?.type,
        name: req.session?.name,
        error: 'Please fill in all required fields.',
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.render('pages/addQuest', {
        speciesList,
        userType: req.session?.type,
        name: req.session?.name,
        error: 'Please select a valid location on the map.',
      });
    }

    const species = await Species.findById(target);
    if (!species) {
      return res.render('pages/addQuest', {
        speciesList,
        userType: req.session?.type,
        name: req.session?.name,
        error: 'Please select a valid species from the list.',
      });
    }

    const { userId } = req.session;
    const newQuest = new Quest({
      questTitle,
      questMission,
      questLocation: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      speciesId: species._id,
      questTimeOfDay,
      questDifficulty,
      questCreatedBy: userId,
      questAcceptedBy: [],
      questFieldNote: '',
      questImage: '',
    });

    await newQuest.save();
    res.redirect('/quests?success=Quest created successfully');
  } catch (error) {
    const speciesList = await Species.find({});
    res.render('pages/addQuest', {
      speciesList,
      userType: req.session?.type,
      name: req.session?.name,
      error: 'Failed to create the quest. Please try again later.',
    });
  }
};

const getQuests = async (req, res) => {
  try {
    const {
      difficulty,
      time,
      creator,
      search,
      page = 1,
      limit = 6,
    } = req.query;

    const filters = {};

    if (difficulty) filters.questDifficulty = difficulty;
    if (time) filters.questTimeOfDay = time;
    if (search) {
      filters.$text = { $search: search };
    }
    if (creator && req.session) {
      if (creator === 'me') filters.questCreatedBy = req.session.userId;
      else if (creator === 'others')
        filters.questCreatedBy = { $ne: req.session.userId };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [quests, total] = await Promise.all([
      Quest.find(filters)
        .populate('speciesId')
        .populate('questCreatedBy', 'firstName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Quest.countDocuments(filters),
    ]);
    const { successMessage } = req.session;
    delete req.session.successMessage;
    res.render('pages/questList', {
      questList: quests,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      userType: req.session?.type || 'guest',
      userId: req.session.userId || '',
      currentFilters: {
        difficulty: difficulty || '',
        time: time || '',
        creator: creator || '',
        search: search || '',
      },
      successMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getResearcherDashboard = async (req, res) => {
  try {
    const { userId } = req.session;

    const quests = await Quest.find({ questCreatedBy: userId })
      .populate('speciesId')
      .lean();

    // Format the data for the frontend map script
    const mapQuests = quests.map((q) => ({
      _id: q._id,
      questTitle: q.questTitle,
      questMission: q.questMission,
      difficulty: q.questDifficulty,
      questTimeOfDay: q.questTimeOfDay,
      speciesName: q.speciesId?.speciesName || 'Unknown Species',
      image: q.speciesId?.speciesImage || '/images/plant4.jpg',
      coordinates: {
        lat: q.questLocation?.coordinates[1],
        lng: q.questLocation?.coordinates[0],
      },
    }));

    res.render('pages/researcherDashboard', {
      quests: mapQuests,
      name: req.session.name,
    });
  } catch (err) {
    console.error('Error fetching quests:', err);
    res.status(500).send('Internal Server Error');
  }
};

const updateQuest = async (req, res, next) => {
  console.log(req.body);
  const questId = req.params.id;
  const {
    questTitle,
    longitude,
    latitude,
    questTimeOfDay,
    questDifficulty,
    questMission,
  } = req.body;

  const updateFields = {
    questTitle,
    questMission,
    questTimeOfDay,
    questDifficulty,
    questLocation: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
  };

  await questCollection.updateOne(
    { _id: new ObjectId(questId) },
    { $set: updateFields }
  );
  next();
};

// DeleteFunction that deletes species data in mongoDB.
const deleteQuest = async (req, res, next) => {
  const questId = req.params.id;
  const objectId = new ObjectId(questId);
  const quest = await questCollection.findOne({ _id: objectId });
  if (quest) {
    await questCollection.deleteOne({ _id: objectId });
  }
  next();
};

const updateSighting = async (req, res, next) => {
  const questId = req.params.id;
  const { userId } = req.session;
  const { questFieldNote, questImage, latitude, longitude } = req.body;

  const questImageUrl = await addImage(req, res, next);

  const updateFields = {
    questFieldNote,
    questLocation: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
    questAcceptedBy: userId,
  };
  if (questImageUrl) {
    updateFields.questImage = questImageUrl;
  }
  updateFields.updatedAt = new Date();

  await Quest.updateOne({ _id: questId }, { $set: updateFields });
  next();
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

const getExplorerDashboard = async (req, res) => {
  try {
    // Get all quests with species data
    const quests = await Quest.find().populate('speciesId').lean();

    // Format the data for the frontend map script
    const mapQuests = quests.map((q) => ({
      _id: q._id,
      questTitle: q.questTitle,
      questMission: q.questMission,
      difficulty: q.questDifficulty,
      questTimeOfDay: q.questTimeOfDay,
      speciesName: q.speciesId?.speciesName || 'Unknown Species',
      image: q.speciesId?.speciesImage || '/images/plant4.jpg',
      coordinates: {
        lat: q.questLocation?.coordinates[1],
        lng: q.questLocation?.coordinates[0],
      },
    }));

    res.render('pages/explorerDashboard', {
      quests: mapQuests,
      name: req.session.name,
    });
  } catch (err) {
    console.error('Error fetching quests:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  createQuest,
  searchTarget,
  renderCreateQuestPage,
  getQuests,
  getResearcherDashboard,
  selectQuestList,
  selectQuest,
  updateQuest,
  deleteQuest,
  updateSighting,
  getExplorerDashboard,
};
