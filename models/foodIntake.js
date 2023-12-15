const { Schema, model } = require('mongoose');

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

module.exports = foodSchema;
