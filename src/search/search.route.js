const express = require('express');
const { body } = require('express-validator');

const validate = require('../util/validate');
const searchController = require('./search.controller');
const { requireAuth } = require('../config/passport.config');

const router = express.Router();

router.use(requireAuth);

router.route('/')
  .post(
    validate([
      body('text', 'Invalid parameter text').notEmpty(),
      body('location', 'Invalid parameter location').notEmpty(),
    ]),
    searchController.create,
  );

module.exports = router;
