const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    goal: {
      type: String,
      enum: ['Lose Fat', 'Maintain', 'Gain Muscle'],
      default: 'Lose Fat',
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: null,
    },
    age: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },

    activity: {
      type: Number,
      default: null,
    },

    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/256/805/805439.png',
    },
    recommendedFat: {
      type: Number,
    },
    recommendedProtein: {
      type: Number,
    },
    recommendedCarbs: {
      type: Number,
    },
    recommendedWater: {
      type: Number,
    },
    recommendedCalories: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleMongooseError);
const User = model('user', userSchema);
const emailSchema = Joi.object({ email: Joi.string().required() });

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  password: Joi.string().min(6).max(15).required(),
  email: Joi.string().email().required(),
  goal: Joi.string(),
  gender: Joi.string().valid('male', 'female'),
  age: Joi.number().integer(),
  height: Joi.number().min(50).max(230),
  weight: Joi.number().min(40).max(200),
  activity: Joi.number().min(1.2).max(1.9),
});

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
};

module.exports = { schemas, User };
