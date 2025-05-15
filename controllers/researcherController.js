require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const saltRounds = 12;
const expireTime = 24 * 60 * 60 * 1000;
const app = express();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

var {database} = include('databaseConnection');
const questCollection = database.db(mongodb_database).collection('quest');

app.use(express.urlencoded({extended: false}));
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

const getSpeciesByName = async (req, res) => {
    try {
        const speciesName = req.params.name;
        const speciesFilePath = path.join(__dirname, "../dummy_species.json");
        const speciesList = JSON.parse(fs.readFileSync(speciesFilePath, "utf8"));

        const species = speciesList.find(sp => sp.commonName.toLowerCase() === speciesName.toLowerCase());

        if (species) {
            res.render("pages/speciesDetail", { title: species.commonName, species: species });
        } else {
            // Optional: Create a specific 404 page for species not found
            res.status(404).render("pages/404", { title: "Not Found" }); 
        }
    } catch (error) {
        console.error("Error fetching species by name:", error);
        res.status(500).send("Error retrieving species data.");
    }
};

module.exports = {createQuest, getSpeciesByName};