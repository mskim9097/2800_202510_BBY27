require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bcrypt = require("bcrypt");
const saltRounds = 12;
const expireTime = 24 * 60 * 60 * 1000;
const app = express();

//Not necessary to create a collection in a seperate file, because mongo will create the collection if it dosen't exist.
// var {database} = include('databaseConnection');
// const questCollection = database.db(mongodb_database).collection('quest');
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

module.exports = {createQuest};