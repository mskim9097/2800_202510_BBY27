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

module.exports = {createQuest};