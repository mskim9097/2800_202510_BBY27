const appClient = require('../databaseConnection').database;
const questCollection = appClient.db('biodiversityGo').collection('quest');
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
    var title = req.body.title;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var mission = req.body.mission;
    var target = req.body.target;
    var timeOfDay = req.body.timeOfDay;
    var difficulty = req.body.difficulty;

    const species = await speciesCollection.findOne({ speciesName: target });

    await questCollection.insertOne({
        questTitle: title,
        questLatitude: latitude,
        questLongitude: longitude,
        questMission: mission,
        speciesId: species._id,
        questTimeOfDay: timeOfDay,
        questDifficulty: difficulty,
        questCreatedBy: req.session.user,
        questImage: null,
        questFieldNote: null,
        questAcceptedBy: null
    });
    next();
}

module.exports = { createQuest, searchTarget }
