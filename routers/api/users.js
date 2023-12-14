const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/users');
const { authenticate } = require('../../middlewares');

router.get('/current', authenticate, ctrl.getCurrent);

module.exports = router;
