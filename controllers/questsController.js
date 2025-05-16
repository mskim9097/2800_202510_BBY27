require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const Quest = require("../models/questModel");

//logic related to researcher routes goes here
// const appClient = require('../databaseConnection').database;
// const questCollection = appClient.db('biodiversityGo').collection('quest');

// const createQuest = async (req, res, next) => {
//     var questName = req.query.questName;
//     // var location = null;
//     var questInfo = req.query.questInfo;
//     var quantity = req.query.quantity;

//     await questCollection.insertOne({
//         questName: questName,
//         location: 'locationInfo',
//         questInfo: questInfo,
//         quantity: quantity,
//         image: null,
//         createdBy: 'loginUserID',
//         note: null,
//         acceptedBy: null
//     });
//     next();
// }

// module.exports = { createQuest }

const createQuest = async (req, res) => {
    try {
        const {
            title,
            mission,
            latitude,
            longitude,
            target,      // this is the species ID from the dropdown
            timeOfDay,
            difficulty
        } = req.body;
        const userId = req.session.userId;
        console.log('BODY:', req.body);
        console.log('SESSION:', req.session);

        const newQuest = new Quest({
            title,
            mission,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            targetSpecies: target,  // Store the species ID
            timeOfDay,
            difficulty,
            createdBy: userId,  // assuming req.user is populated by auth middleware
            acceptedBy: []            // starts empty
        });

        await newQuest.save();
        res.redirect("/user/researcher");
    } catch (error) {
        console.error('Error creating quest:', error);
        res.status(500).send('Something went wrong while creating the quest.');
    }
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

module.exports = { createQuest, searchTarget }
