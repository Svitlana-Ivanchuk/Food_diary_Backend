const { Schema, model } = require('mongoose');
const moment = require('moment');
const { handleMongooseError } = require('../helpers');

const statisticSchema = Schema({
  totalCalories: {
    type: Number,
    required: true,
  },
  totalMacro: [
    {
      carbonohidrates: { type: Number, required: true },
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  date: {
    type: String,
    default: () => moment().format('YYYY-MM-DD'),
    required: true,
  },
});

statisticSchema.post('save', handleMongooseError);
const Statistic = model('static', statisticSchema);

module.exports = { Statistic };
