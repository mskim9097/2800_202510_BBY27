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

module.exports = { createQuest }