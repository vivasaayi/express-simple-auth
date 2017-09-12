const passportAuthentication = require("./strategies/passport");

const localAuthRoute = require("./local-authentication");
const facebookAuthRoute = require("./facebook-authentication");
const googleAuthRoute = require("./google-authentication");

function registerAuthRoutes(app) {
  passportAuthentication.initializePassport(app);

  app.use(localAuthRoute);
  app.use(facebookAuthRoute);
  app.use(googleAuthRoute);
}

module.exports = {
  registerAuthRoutes
};