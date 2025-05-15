require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const quest = require("../models/questModel");

//logic related to researcher routes goes here

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
            createdBy: req.user._id,  // assuming req.user is populated by auth middleware
            acceptedBy: []            // starts empty
        });

        await newQuest.save();
        res.redirect('/researcher/Dashboard');
    } catch (error) {
        console.error('Error creating quest:', error);
        res.status(500).send('Something went wrong while creating the quest.');
    }
};

module.exports = {createQuest};