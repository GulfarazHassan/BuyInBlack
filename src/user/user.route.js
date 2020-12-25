const express = require('express');
const { body } = require('express-validator');

const validate = require('../util/validate');
const userController = require('./user.controller');
const { requireAuth } = require('../config/passport.config');

const router = express.Router();

router.post(
  '/auth/login',
  validate([
    body('id', 'Invalid parameter id').notEmpty(),
  ]),
  userController.login,
);

router.route('/me')
  .all(requireAuth)
  .get(userController.get)
  .put(userController.update);

router.route('/me/favorites')
  .all(requireAuth)
  .get(userController.getFavorites)
  .post(
    validate([
      body('id', 'Invalid parameter id').notEmpty(),
    ]),
    userController.addToFavorites,
  );

router.route('/me/favorites/:id')
  .all(requireAuth)
  .get(userController.getFavorite)
  .delete(userController.removeFromFavorites);

module.exports = router;
