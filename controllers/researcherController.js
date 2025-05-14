require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bcrypt = require("bcrypt");
const saltRounds = 12;
const expireTime = 24 * 60 * 60 * 1000;
const app = express();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

var { database } = include('databaseConnection');
const questCollection = database.db(mongodb_database).collection('quest');
const speciesCollection = database.db(mongodb_database).collection('spicies');


app.use(express.urlencoded({ extended: false }));
//logic related to researcher routes goes here

const createQuest = async (req, res) => {
    var questName = req.query.questName;
    // var location = null;
    var questInfo = req.query.questInfo;
    var quantity = req.query.quantity;

    await questCollection.insertOne({
        questName: questName,
        location: 'locationInfo',
        questInfo: questInfo,
        quantity: quantity,
        image: null,
        createdBy: 'loginUserID',
        note: null,
        acceptedBy: null
    });

    res.redirect("/");
}

const createSpecies = async (req, res) => {
    const speciesName = req.query.speciesName;
    const speciesInfo = req.query.speciesInfo;
    const speciesScientificName = req.query.speciesScientificName;
    const speciesImage = [];
    speciesImage[0] = req.query.speciesImage;

    //This fields are set to null until updated by quests
    const speciesQuests = [];
    const speciesLocations = {};

    await speciesCollection.insertOne({
        speciesName: speciesName,
        speciesInfo: speciesInfo,
        speciesImage: speciesImage,
        speciesLocation: speciesLocations,
        speciesQuantity: speciesQuantity,
        speciesQuests: speciesQuests,
        speciesScientificName: speciesScientificName
    });
    res.redirect("/");
}

//This updates the same fields as createSpecies
const updateSpecies = async (req, res) => {
    const speciesName = req.query.speciesName;
    const speciesScientificName = req.query.speciesScientificName;
    const speciesInfo = req.query.speciesInfo;
    const speciesImage = [];
    speciesImage[0] = req.query.speciesImage;
    //list of Quest IDs related to this species

    await speciesCollection.updateOne(
        { speciesName: speciesName },
        {
            $set: {
                speciesInfo: speciesInfo,
                speciesImage: speciesImage,
                speciesLocation: speciesLocation,
                speciesQuantity: speciesQuantity,
                speciesQuests: speciesQuests,
                speciesScientificName: speciesScientificName
            }
        }
    );
    res.redirect("/");
}

const getSpecies = async (req, res) => {
    const speciesScientificName = req.query.speciesScientificName;
    const species = await speciesCollection.findOne({ speciesName: speciesScientificName });
    if (species) {
        res.status(200).json(species);
    } else {
        res.status(404).json({ message: "Species not found" });
    }
}

module.exports = { createQuest, createSpecies, updateSpecies, getSpecies };