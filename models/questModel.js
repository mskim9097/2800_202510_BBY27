// models/Quest.js

const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    questTitle: { type: String, required: true},
    questMission: { type: String, required: true},
    questLocation: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    speciesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Species',required: true },//required: true
    questTimeOfDay: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'], required: true },
    questDifficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    questCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
    questAcceptedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    questFieldNote: {type: String},
    questImage: {type: String}
}, {
    timestamps: true
});

questSchema.index({ location: '2dsphere' }); 
questSchema.index({ questTitle: 'text', questMission: 'text' });
module.exports = mongoose.model('Quest', questSchema);
