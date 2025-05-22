require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const Quest = require("../models/questModel");
const Species = require('../models/specieModel');

const appClient = require('../databaseConnection').database;

const speciesCollection = appClient.db('biodiversityGo').collection('species');
const questCollection = appClient.db('biodiversityGo').collection('quests');
const { ObjectId } = require('mongodb');

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

    if (!quest) {
      return res.status(404).send("Quest not found");
    }

    const species = await Species.findById(quest.speciesId);

    if (!species) {
      return res.status(404).send("Species not found");
    }

    res.render("pages/quest", { quest, species });
  } catch (error) {
    console.error("Error fetching quest or species:", error);
    res.status(500).send("Error retrieving quest details");
  }
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
  res.redirect(`/quests/${newQuest._id}`);
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

module.exports = { createQuest, searchTarget, selectQuestList, selectQuest, updateQuest, deleteQuest };
