const JWT = require('jsonwebtoken');

const User = require('./user.model');
const Business = require('../business/business.model');
const { JWT_SECRET } = require('../config/secrets.config');

/**
 * POST /users/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { id, location } = req.body;

    const existingUser = await User.findById(id);

    const token = JWT.sign({ sub: id, iat: Date.now() }, JWT_SECRET);

    if (existingUser) {
      res.status(200).json({
        token,
        user: existingUser,
      });
    } else {
      const user = new User({
        _id: id,
      });

      if (location && location.longitude && location.latitude) {
        user.location = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }

      await user.save();

      res.status(200).json({
        user,
        token,
      });
    }
  } catch (e) {
    next(e);
  }
};

/**
 * GET /users/me
 */
exports.get = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (e) {
    next(e);
  }
};

/**
 * PUT /users/me
 */
exports.update = async (req, res, next) => {

  try {
    const { location_enabled, location, review_us, feedback, push_notifications } = req.body;

    if (location_enabled !== undefined) {
      req.user.location_enabled = location_enabled;
    }

    if (location && location.longitude && location.latitude) {
      req.user.location = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }


    if (review_us) {
      req.user.app_alerts.review_us = { ...req.user.app_alerts.review_us, ...review_us }
    }

    if (feedback) {
      req.user.app_alerts.feedback = { ...req.user.app_alerts.feedback, ...feedback }
    }

    if (push_notifications) {

      req.user.push_notifications = [...req.user.push_notifications, push_notifications]
    }

    await req.user.save();

    res.status(200).json(req.user);
  } catch (e) {
    next(e);
  }
};

/**
 * GET /users/me/favorites
 */
exports.getFavorites = async (req, res, next) => {
  try {
    if (req.user.favorites && req.user.favorites.length) {
      const user = await req.user.populate({
        path: 'favorites',
        select: '_id business_name phone_number address web_only location',
      }).execPopulate();

      const favorites = user.favorites.map((item) => ({
        _id: item.id,
        address: item.address,
        web_only: item.web_only,
        phone_number: item.phone_number,
        business_name: item.business_name,
        location: item.location.coordinates,
      }));

      res.status(200).json(favorites);
    } else {
      res.status(200).json([]);
    }
  } catch (e) {
    next(e);
  }
};

/**
 * GET /users/me/favorites/:id
 */
exports.getFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);

    if (
      business
      && Array.isArray(req.user.favorites)
      && req.user.favorites.includes(id)
    ) {
      res.status(200).json({
        ...business.toJSON(),
        location: business.location.coordinates,
      });
    } else {
      res.status(400).json({
        error: 'invalid_request',
        error_description: 'Favorite not found with the given id',
      });
    }
  } catch (e) {
    next(e);
  }
};

/**
 * POST /users/me/favorites
 */
exports.addToFavorites = async (req, res, next) => {
  try {
    const { id } = req.body;

    const business = await Business.findById(id, { _id: 1 });

    if (business) {
      await req.user.update({ $addToSet: { favorites: id } });

      res.status(200).json(req.user);
    } else {
      res.status(400).json({
        error: 'invalid_request',
        error_description: 'Business with the given id not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

/**
 * DELETE /users/me/favorites/:id
 */
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;

    await req.user.update({ $pull: { favorites: id } });

    res.status(200).json(req.user);
  } catch (e) {
    next(e);
  }
};
