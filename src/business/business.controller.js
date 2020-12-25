const Business = require('./business.model');

const METERS_PER_MILE = 1609.34;

/**
 * GET /businesses
 */
exports.get = async (req, res, next) => {
  try {
    const {
      lng,
      lat,
      search,
      distance = 10,
    } = req.query;

    /**
     * Aggregation with location search
     */
    const aggregation = [{
      $geoNear: {
        near: { type: 'Point', coordinates: [+lng, +lat] },
        spherical: true,
        distanceField: 'calculated_distance',
        maxDistance: distance * METERS_PER_MILE,
        distanceMultiplier: 1 / METERS_PER_MILE,
      },
    }];


    /**
     * Add text search
     */
    aggregation[0].$geoNear.query = {
      $or: [
        {
          business_name: new RegExp(search, 'i'),
        },
        {
          tags: new RegExp(search, 'i'),
        },
        {
          products: new RegExp(search, 'i'),
        },
      ],
    };

    /**
     * Add projection
     */
    aggregation.push({
      $project: {
        _id: 1,
        address: 1,
        web_only: 1,
        location: '$location.coordinates',
        search_rank: 1,
        phone_number: 1,
        business_name: 1,
        calculated_distance: 1,
      },
    });

    aggregation.push({ $sort: { search_rank: -1 } });

    const businesses = await Business.aggregate(aggregation);

    res.status(200).json(businesses);
  } catch (e) {
    next(e);
  }
};


/**
 * GET /businesses/web_only
 */
exports.getWebOnly = async (req, res, next) => {
  try {
    /**
     * Aggregation with text search on (business_name, tags, products)
     */
    const aggregation = [
      { $match: { $text: { $search: req.query.search } } },
      { $match: { web_only: true } },
      {
        $project: {
          _id: 1,
          score: { $meta: 'textScore' },
          address: 1,
          web_only: 1,
          search_rank: 1,
          phone_number: 1,
          business_name: 1,
        },
      },
      { $sort: { score: -1, search_rank: -1 } },
    ];

    const businesses = await Business.aggregate(aggregation);

    res.status(200).json(businesses);
  } catch (e) {
    next(e);
  }
};

/**
 * GET /businesses/:id
 */
exports.getDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);

    if (business) {
      res.status(200).json({
        ...business.toJSON(),
        location: business.location.coordinates,
      });
    } else {
      res.status(400).json({
        error: 'invalid_request',
        error_description: 'Business with the given id is not found',
      });
    }
  } catch (e) {
    next(e);
  }
};
