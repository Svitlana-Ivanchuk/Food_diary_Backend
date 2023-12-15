const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const waterSchema = new Schema({
  value: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

waterSchema.post('save', handleMongooseError);
const Water = model('water', waterSchema);

module.exports = { Water };
