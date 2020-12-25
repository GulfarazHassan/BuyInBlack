const express = require('express');
const { query, param } = require('express-validator');

const validate = require('../util/validate');
const businessController = require('./business.controller');
const { requireAuth } = require('../config/passport.config');

const router = express.Router();

router.use(requireAuth);

router.route('/')
  .get(
    validate([
      query('lng', 'Invalid parameter lng').notEmpty(),
      query('lat', 'Invalid parameter lat').notEmpty(),
      query('search', 'Invalid parameter text').optional(),
    ]),
    businessController.get,
  );

router.route('/web_only')
  .get(
    validate([
      query('search', 'Invalid parameter search').notEmpty(),
    ]),
    businessController.getWebOnly,
  );

router.route('/:id')
  .get(
    validate([
      param('id', 'Invalid parameter id').notEmpty(),
    ]),
    businessController.getDetails,
  );

module.exports = router;
