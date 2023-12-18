const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const weightSchema = Schema({
  weights: {
    type: Map,
    of: Number,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

weightSchema.post('save', handleMongooseError);
const Weight = model('weight', weightSchema);

module.exports = { Weight };
