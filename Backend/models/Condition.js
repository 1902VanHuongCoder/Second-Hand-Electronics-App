const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  condition: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Condition = mongoose.model('Condition', conditionSchema);

module.exports = Condition; 