/** @format */

const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
//   token: String,

//   avatarURL: {
//     type: String,
//     required: true,
//   },
});

const User = model("user", userSchema);
const emailSchema = Joi.object({ email: Joi.string().required() });

const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
};

module.exports = { schemas, User };
