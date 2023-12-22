const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const weightSchema = new Schema(
  {
    weights: {
      type: Map,
      of: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false },
);

weightSchema.post('save', handleMongooseError);
const Weight = model('weight', weightSchema);

const userWeightSchema = Joi.object({
  weights: Joi.number().positive().max(300).required(),
});

module.exports = { Weight, userWeightSchema };
