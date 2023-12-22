const jwt = require('jsonwebtoken');

const { User } = require('../models');
require('dotenv').config();

const { HttpError } = require('../helpers');

const { ACCESS_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized'));
    return;
  }

  try {
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.accessToken) {
      next(HttpError(401, 'Not authorized'));
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    next(HttpError(401, 'Not authorized'));
  }
};

module.exports = authenticate;
