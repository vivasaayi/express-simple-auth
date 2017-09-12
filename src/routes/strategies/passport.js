const passport = require("passport");

const facebookStrategy = require("./facebook-strategy");
const googleStrategy = require("./google-strategy");
const localStrategy = require("./local-strategy");

const usersService = require("../../services/users-service");
const logger = require("../../utils/logger");

const userNamePasswordFields = {
  usernameField: "email",
  passwordField: "password"
};

function authenticateUsers(userName, password, done) {
  logger.log("Validating Login");
  usersService.validateLogin(userName, password)
    .then((user) => {
      logger.log("Passport:authenticateUsers:", "Login Success", user);
      return done(null, user);
    })
    .catch((err) => {
      logger.log("Passport:authenticateUsers:", "Login Failed", err);
      return done(null, false, { message: err });
    });
}

function authenticationMiddleware(req, res, next) {
  logger.log("Authentication Middleware");
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

function serializeUser(user, done) {
  logger.log("Serializing User");
  done(null, {
    displayName: user.displayname,
    email: user.email,
    avatar: user.avatar,
    _id: user._id
  });
}

function deserializeUser(user, done) {
  logger.log("De-Serializing User", user);
  done(null, user);
}

function initializePassport(app, router) {
  logger.log("Initializing Passport");

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(facebookStrategy);
  passport.use(googleStrategy);
  passport.use(localStrategy);

  passport.authenticationMiddleware = authenticationMiddleware;

  logger.log("Passport Initialized");
}

module.exports = {
  initializePassport
};