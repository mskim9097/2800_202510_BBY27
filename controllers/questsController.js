require('dotenv').config();
// const express = require('express');
// const Joi = require("joi");
const Quest = require('../models/questModel');

const appClient = require('../databaseConnection').database;
// const questCollection = appClient.db('biodiversityGo').collection('quests');
const speciesCollection = appClient.db('biodiversityGo').collection('species');

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

// createQuest function that saves quest document in mongoDB.
const createQuest = async (req, res, next) => {
  const questTitle = req.body.title;
  const questMission = req.body.mission;
  const { latitude } = req.body;
  const { longitude } = req.body;
  const { target } = req.body;
  const questTimeOfDay = req.body.timeOfDay;
  const questDifficulty = req.body.difficulty;
  const species = await speciesCollection.findOne({ speciesName: target });
  const { userId } = req.session;

  const newQuest = new Quest({
    questTitle,
    questMission,
    questLocation: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
    speciesId: species._id, // Store the species ID
    questTimeOfDay,
    questDifficulty,
    questCreatedBy: userId, // assuming req.user is populated by auth middleware
    questAcceptedBy: [], // starts empty
    questFieldNote: '',
    questImage: '',
  });
  await newQuest.save();
  next();
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
    }

    res.locals.questList = questList;
    next();
  } catch (err) {
    console.error('Error fetching quest list:', err);
    res.status(500).send('Error fetching quest list');
  }
};

module.exports = { createQuest, searchTarget, selectQuestList };
