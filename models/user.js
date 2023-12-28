const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const goalList = ['Lose Fat', 'Maintain', 'Gain Muscle'];
const genderList = ['male', 'female'];
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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
      match: emailRegexp,
      unique: true,
    },
    goal: {
      type: String,
      enum: goalList,
      default: 'Lose Fat',
    },
    gender: {
      type: String,
      enum: genderList,
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

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  password: Joi.string().min(6).max(15).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  goal: Joi.string()
    .valid(...goalList)
    .required(),
  gender: Joi.string()
    .valid(...genderList)
    .required(),
  age: Joi.number().integer().positive().required(),
  height: Joi.number().min(50).max(230).positive().required(),
  weight: Joi.number().min(40).max(200).positive().required(),
  activity: Joi.number().min(1.2).max(1.9).positive().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(15).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const updateGoalSchema = Joi.object({
  goal: Joi.string()
    .valid(...goalList)
    .required(),
});

const updateAvatarSchema = Joi.object({
  avatarURL: Joi.string().required().error(new Error('Nothing to update')),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
  updateGoalSchema,
  updateAvatarSchema,
};

module.exports = { schemas, User };
