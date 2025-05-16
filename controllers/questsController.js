const appClient = require('../databaseConnection').database;
const questCollection = appClient.db('biodiversityGo').collection('quest');

const createQuest = async (req, res, next) => {
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
    next();
}

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