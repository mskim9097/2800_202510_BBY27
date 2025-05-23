const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  speciesScientificName: {
    type: String,
    required: true,
    trim: true,
  },
  speciesName: {
    type: String,
    required: true,
    trim: true,
  },
  speciesInfo: {
    type: String,
    required: true,
  },
  speciesImage: {
    type: [String],
    default: [],
  },
  speciesHabitat: {
    type: String,
    required: true,
  },
  speciesType: {
    type: String,
    required: true,
    enum: ['Plant', 'Animal', 'Bird', 'Insect', 'Other'],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Researcher',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Species', speciesSchema);
