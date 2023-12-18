const { Schema, model } = require('mongoose');
const moment = require('moment');

const foodSchema = new Schema({
  breakfast: [
    {
      name: { type: String, required: true },
      carbonohidrates: { type: Number, required: true },
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
      calories: { type: Number, required: true },
    },
  ],
  lunch: [
    {
      name: { type: String, required: true },
      carbonohidrates: { type: Number, required: true },
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
      calories: { type: Number, required: true },
    },
  ],
  dinner: [
    {
      name: { type: String, required: true },
      carbonohidrates: { type: Number, required: true },
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
      calories: { type: Number, required: true },
    },
  ],
  snack: [
    {
      name: { type: String, required: true },
      carbonohidrates: { type: Number, required: true },
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
      calories: { type: Number, required: true },
    },
  ],
  date: {
    type: String,
    default: () => moment().format('YYYY-MM-DD'),
    required: true,
  },

  totalCalories: {
    type: Number,
    required: true,
  },

  totalMacro: [
    {
      totalCarbs: { type: Number, required: true },
      totalProtein: { type: Number, required: true },
      totalFat: { type: Number, required: true },
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const Food = model('food-intake', foodSchema);

module.exports = { Food };
