const passportAuthentication = require("./strategies/passport");

const localAuthRoute = require("./local-authentication");
const facebookAuthRoute = require("./facebook-authentication");
const googleAuthRoute = require("./google-authentication");

function registerAuthRoutes(app, router) {
  passportAuthentication.initializePassport(app, router);

  app.use(localAuthRoute.registerLocalAuthRoutes(router));
  app.use(facebookAuthRoute.registerFacebookAuth(router));
  app.use(googleAuthRoute.registerGoogleAuth(router));
}

module.exports = {
  registerAuthRoutes
};