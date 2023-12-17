const { Schema, model } = require('mongoose');
const moment = require('moment');

const foodSchema = new Schema({
  breakfast: [
    {
      name: { type: String },
      carbonohidrates: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
      calories: { type: Number },
    },
  ],
  lunch: [
    {
      name: { type: String },
      carbonohidrates: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
      calories: { type: Number },
    },
  ],
  dinner: [
    {
      name: { type: String },
      carbonohidrates: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
      calories: { type: Number },
    },
  ],
  snack: [
    {
      name: { type: String },
      carbonohidrates: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
      calories: { type: Number },
    },
  ],
  date: {
    type: String,
    default: () => moment().format('YYYY-MM-DD'),
    required: true,
  },

  totalCalories: {
    type: Number,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const Food = model('food-intake', foodSchema);

module.exports = Food;
