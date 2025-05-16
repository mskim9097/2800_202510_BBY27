// models/Quest.js

const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    title: { type: String, required: true },
    mission: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    targetSpecies: { type: mongoose.Schema.Types.ObjectId, ref: 'Species' },//required: true
    timeOfDay: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },//required: true
    acceptedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

questSchema.index({ location: '2dsphere' }); 

module.exports = mongoose.model('Quest', questSchema);
