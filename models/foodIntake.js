const { Schema, model, default: mongoose } = require('mongoose');
const Joi = require('joi');
const moment = require('moment');
const { handleMongooseError } = require('../helpers');

const foodSchema = new Schema(
  {
    breakfast: {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },

      dish: [
        {
          name: { type: String, required: true },
          carbonohidrates: { type: Number, required: true },
          protein: { type: Number, required: true },
          fat: { type: Number, required: true },
          calories: { type: Number, required: true },
        },
      ],

      totalCalories: { type: Number },
      totalCarbs: { type: Number },
      totalProtein: { type: Number },
      totalFat: { type: Number },
    },

    lunch: {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      dish: [
        {
          name: { type: String, required: true },
          carbonohidrates: { type: Number, required: true },
          protein: { type: Number, required: true },
          fat: { type: Number, required: true },
          calories: { type: Number, required: true },
        },
      ],

      totalCalories: { type: Number },
      totalCarbs: { type: Number },
      totalProtein: { type: Number },
      totalFat: { type: Number },
    },

    dinner: {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      dish: [
        {
          name: { type: String, required: true },
          carbonohidrates: { type: Number, required: true },
          protein: { type: Number, required: true },
          fat: { type: Number, required: true },
          calories: { type: Number, required: true },
        },
      ],

      totalCalories: { type: Number },
      totalCarbs: { type: Number },
      totalProtein: { type: Number },
      totalFat: { type: Number },
    },

    snack: {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      dish: [
        {
          name: { type: String, required: true },
          carbonohidrates: { type: Number, required: true },
          protein: { type: Number, required: true },
          fat: { type: Number, required: true },
          calories: { type: Number, required: true },
        },
      ],

      totalCalories: { type: Number },
      totalCarbs: { type: Number },
      totalProtein: { type: Number },
      totalFat: { type: Number },
    },

    date: {
      type: String,
      default: () => moment().format('YYYY-MM-DD'),
      required: true,
    },

    totalCalories: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false },
);

foodSchema.post('save', handleMongooseError);
const Food = model('food-intake', foodSchema);

module.exports = { Food };
