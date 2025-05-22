require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const Quest = require("../models/questModel");
const Species = require("../models/specieModel");

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

module.exports = { createQuest, searchTarget, renderCreateQuestPage, getQuests, getResearcherDashboard }
