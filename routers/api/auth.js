const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth');
const { schemas } = require('../../models/user');
const { validateBody, authenticate } = require('../../middlewares');

router.post('/signup', validateBody(schemas.registerSchema), ctrl.signup);
router.post('/signin', validateBody(schemas.loginSchema), ctrl.signin);

// router.post('/refresh', validateBody(schemas.refreshSchema), ctrl.refresh);

router.post('/signout', authenticate, ctrl.signout);
router.post('/forgot-password', ctrl.forgotPassword);
router.get('/current', authenticate, ctrl.current);

module.exports = router;
