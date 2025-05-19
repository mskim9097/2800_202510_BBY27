require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const Quest = require("../models/questModel");

const appClient = require('../databaseConnection').database;
const questCollection = appClient.db('biodiversityGo').collection('quests');
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
    var questTitle = req.body.title;
    var questMission = req.body.mission;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var target = req.body.target;
    var questTimeOfDay = req.body.timeOfDay;
    var questDifficulty = req.body.difficulty;

    const species = await speciesCollection.findOne({ speciesName: target });
    const userId = req.session.userId;

    const newQuest = new Quest({
            questTitle,
            questMission,
            questLocation: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            speciesId: species._id,  // Store the species ID
            questTimeOfDay,
            questDifficulty,
            questCreatedBy: userId,  // assuming req.user is populated by auth middleware
            questAcceptedBy: [],            // starts empty
            questFieldNote: '',
            questImage: ''
        });
    await newQuest.save();

    next();
}

module.exports = { createQuest, searchTarget }
