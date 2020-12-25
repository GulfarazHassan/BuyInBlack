const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const debug = require('debug')('server:app');

require('./config/passport.config');
const userRouter = require('./user/user.route');
const searchRouter = require('./search/search.route');
const businessRouter = require('./business/business.route');
const { MONGODB_URI } = require('./config/secrets.config');

const app = express();

const port = process.env.PORT || 8080;

/**
 * Database connection
 */
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(e => console.log('connedted to database ...'))
  .catch((e) => {
    debug(e.message);
  });


/**
 * Express configuration
 */
app.use(logger('dev'));

app.use(cors());

app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.2.10' }));

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

/**
 * App routes
 */
app.use('/api/users', userRouter);

app.use('/api/searches', searchRouter);

app.use('/api/businesses', businessRouter);

/**
 * Not found routes
 */
app.use('/api/*', async (req, res) => {
  res.status(404).json({
    error: 'Not found',
    error_description: 'Not found',
  });
});

app.get('/*', async (req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => debug(`BBNM listening on port ${port}!`));
