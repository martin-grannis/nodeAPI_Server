// setup the trategies for passport
// local for checking passwords on host
// and JWT for sending and retrieveing JWT

const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user.model');


const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;


const { JWT_SECRET } = require('../config');




//authenticate user via local host connection ie password checking
passport.use(new LocalStrategy({
  emailField: 'email',
  passwordField: 'password',
}, async (username, password, done) => {
  try {
    const userDocument = await UserModel.findOne({email: email}).exec();
    const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

    if (passwordsMatch) {
      return done(null, userDocument);
    } else {
      return done('Incorrect Username / Password');
    }
  } catch (error) {
    done(error);
  }
}));

//authenticate user via JWT token
passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: JWT_SECRET,
  },
  (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done('jwt expired');
    }

    return done(null, jwtPayload);
  }
));

