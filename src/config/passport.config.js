const passport = require('passport');
const {
  ExtractJwt,
  Strategy: JWTStrategy,
} = require('passport-jwt');

const User = require('../user/user.model');
const { JWT_SECRET } = require('.//secrets.config');

passport.use('jwt', new JWTStrategy({
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
},
((payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) {
      done(err, false);
    } else if (!user) {
      done(null, false);
    } else {
      done(null, user);
    }
  });
})));

exports.requireAuth = passport.authenticate('jwt', { session: false });
