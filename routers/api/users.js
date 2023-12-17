const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/users');
const { authenticate, uploadCloud } = require('../../middlewares');

router.get('/current', authenticate, ctrl.getCurrent);

router.put(
  '/update',
  authenticate,
  uploadCloud.single('avatarURL'),
  ctrl.updateUser,
);

module.exports = router;
