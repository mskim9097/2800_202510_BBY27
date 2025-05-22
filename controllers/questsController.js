require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const Quest = require("../models/questModel");
const Species = require("../models/specieModel");
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

const selectQuestList = async (req, res, next) => {
  try {
    let questList;

    if (req.session.type === 'researcher') {
      const { userId } = req.session;
      questList = await Quest.find({ questCreatedBy: userId }).sort({
        createdAt: -1,
      });
    } else {
      questList = await Quest.find().sort({ createdAt: -1 });
      console.log(questList);
    }

    res.locals.questList = questList;
    next();
  } catch (err) {
    console.error('Error fetching quest list:', err);
    res.status(500).send('Error fetching quest list');
  }
};

// select specific quest
const selectQuest = async (req, res) => {
  try {
    const questId = req.params.id;
    const quest = await Quest.findById(questId);
    const userId = req.session.userId;

    if (!quest) {
      return res.status(404).send("Quest not found");
    }

    const species = await Species.findById(quest.speciesId);

    if (!species) {
      return res.status(404).send("Species not found");
    }

    res.render("pages/quest", { quest, species, userId });
  } catch (error) {
    console.error("Error fetching quest or species:", error);
    res.status(500).send("Error retrieving quest details");
  }
};


const renderCreateQuestPage = async (req, res) => {
  try {
    const speciesList = await Species.find({});
    res.render('pages/addQuest', { speciesList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};



const createQuest = async (req, res, next) => {
  const speciesList = await Species.find({});
  var questTitle = req.body.title;
  var questMission = req.body.mission;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var target = req.body.target;
  var questTimeOfDay = req.body.timeOfDay;
  var questDifficulty = req.body.difficulty;
  let species = await Species.findById(target);
  if (!species) {
    return res.status(400).send("Please select a valid species from the list.");
  }
  const userId = req.session.userId;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (!questTitle || !questMission || !target || !questTimeOfDay || !questDifficulty) {
    return res.status(400).render("pages/addQuest", {
      speciesList,
      error: "Please fill in all required fields."
    });
  }

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).render("pages/addQuest", {
      speciesList,
      error: "Please select a location on the map."
    });
  }

  const newQuest = new Quest({
    questTitle,
    questMission,
    questLocation: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    },
    speciesId: species._id,
    questTimeOfDay,
    questDifficulty,
    questCreatedBy: userId,
    questAcceptedBy: [],
    questFieldNote: '',
    questImage: ''
  });
  await newQuest.save();
  const questName = questTitle;

  req.session.successMessage = `✅ Quest "${questName}" created successfully.`;

  next();
}


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
      else if (creator === 'others') filters.questCreatedBy = { $ne: req.session.userId };
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
    const successMessage = req.session.successMessage;
    delete req.session.successMessage;
    res.render('pages/questList', {
      questList: quests,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      userType: req.session?.type || 'guest',
      userId: req.session.userId || '',
      currentFilters: {
        difficulty: difficulty || "",
        time: time || "",
        creator: creator || "",
        search: search || ""
      },
      successMessage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getResearcherDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;

    const quests = await Quest.find({ questCreatedBy: userId }).lean();

    // Format the data for the frontend map script
    const mapQuests = quests.map(q => ({
      questTitle: q.questTitle,
      questMission: q.questMission,
      questLocation: q.questLocation?.coordinates
        ? `(${q.questLocation.coordinates[1]}, ${q.questLocation.coordinates[0]})`
        : 'Unknown',
      coordinates: {
        lat: q.questLocation?.coordinates[1],
        lng: q.questLocation?.coordinates[0]
      }
    }));

    res.render('pages/researcherDashboard', { quests: mapQuests }); // ✅ Make sure your EJS uses "quests"
  } catch (err) {
    console.error("Error fetching quests:", err);
    res.status(500).send("Internal Server Error");
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
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    }
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
  const {
    questFieldNote,
    questImage,
    latitude,
    longitude
  } = req.body;

  const questImageUrl = await addImage(req, res, next);

  const updateFields = {
    questFieldNote,
    questLocation: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    },
    questAcceptedBy: userId
  };
  if (questImageUrl) {
    updateFields.questImage = questImageUrl;
  }
  updateFields.updatedAt = new Date();

  await Quest.updateOne(
    { _id: questId },
    { $set: updateFields }
  );
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
// const selectQuestList = async (req, res, next) => {
//     try {
//         let questList;

//         if (req.session.type === "researcher") {
//             const userId = req.session.userId;
//             questList = await Quest.find({ questCreatedBy: userId }).sort({ createdAt: -1 });
//         } else {
//             questList = await Quest.find().sort({ createdAt: -1 });
//         }

//         res.locals.questList = questList;
//         next();
//     } catch (err) {
//         console.error("Error fetching quest list:", err);
//         res.status(500).send("Error fetching quest list");
//     }
// };

const getExplorerDashboard = async (req, res) => {
  try {
    // Get all quests
    const quests = await Quest.find().lean();

    // Format the data for the frontend map script
    const mapQuests = quests.map(q => ({
      _id: q._id,
      questTitle: q.questTitle,
      questMission: q.questMission,
      difficulty: q.difficulty,
      questLocation: q.questLocation?.coordinates
        ? `(${q.questLocation.coordinates[1]}, ${q.questLocation.coordinates[0]})`
        : 'Unknown',
      coordinates: {
        lat: q.questLocation?.coordinates[1],
        lng: q.questLocation?.coordinates[0]
      }
    }));

    res.render('pages/explorerDashboard', { 
      quests: mapQuests,
      name: req.session.name 
    });
  } catch (err) {
    console.error("Error fetching quests:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createQuest, searchTarget, renderCreateQuestPage, getQuests, getResearcherDashboard, selectQuestList, selectQuest, updateQuest, deleteQuest, updateSighting, getExplorerDashboard }


