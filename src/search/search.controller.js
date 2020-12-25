const Search = require('./search.model');

/**
 * POST /searches
 */
exports.create = async (req, res, next) => {
  try {
    const { text, location } = req.body;

    await Search.create({
      text,
      user: req.user._id,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });

    res.status(201).json({});
  } catch (e) {
    next(e);
  }
};
