const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const waterSchema = new Schema({
  waters: {
    type: Map,
    of: Number,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

waterSchema.post('save', handleMongooseError);
const Water = model('water', waterSchema);

const userWaterSchema = Joi.object({
  water: Joi.number().positive(),
});

module.exports = { Water, userWaterSchema };
