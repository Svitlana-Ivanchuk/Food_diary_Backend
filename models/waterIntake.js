const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');
const moment = require('moment');

const waterSchema = new Schema({
  value: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: () => moment().format('YYYY-MM-DD'),
    required: true,
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
