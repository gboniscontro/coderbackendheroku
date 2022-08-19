const passport = require('passport');
const logger = require('../logger');
const local = require('passport-local');
const { MONGO_URI } = require('../config/globals');
const { createHash, isValidPassword } = require('../utils.js');
const UsersService = require('./usersService');
const userService = new UsersService();


const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
      try {
        logger.info(`passportService.js - passport.use --> register`);
        try {
          let user = await userService.getUsuario(username);
          if (user) return done(null, false);
        } catch (error) {
          logger.error(`passportService.js - passport.use --> register ${error}`);
        }

        const newUser = req.body;
        newUser.email = username;

        try {
          let result = await userService.crearUsuario(newUser);
          return done(null, result);
        } catch (err) {
          // console.log(err)
          done(err);
        }
      } catch (err) {
        // console.log(err)
        done(err);
      }
    }),
  );

  passport.use(
    'login',
    new LocalStrategy(async (username, password, done) => {
      try {
        logger.info(`passportService.js - passport.use --> login ${username}`);

        let user = await userService.login(username, password);
       // logger.info('invalid password o user not found', user);
        if (!user) {
         // logger.info('invalid password o user not found');
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
      } catch (err) {
       // logger.info('error not found');
        done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    logger.info(`passportService.js - passport.serializeUser ${JSON.stringify(user)}`);
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    logger.info(`passportService.js - passport.deserializeUser ${JSON.stringify(user)}`);

    done(null, user);
  });
};
module.exports = initializePassport;
