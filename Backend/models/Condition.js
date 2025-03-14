const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({ // This collection is used to store the condition of the product (e.g: new, used, ...)
  condition: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Condition = mongoose.model('Condition', conditionSchema);

module.exports = Condition; 