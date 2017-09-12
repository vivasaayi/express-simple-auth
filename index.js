const loginRoutes = require("./src/routes/login-routes");
const registrationRoutes = require("./src/routes/registration-routes");

const logger = require("./src/utils/logger");
const mailProxy = require("./src/proxies/mail-proxy");

function init(app, router) {
  logger.log("Registering Routes");

  loginRoutes.registerAuthRoutes(app, router);
  registrationRoutes.registerRegistrationRoutes(router);
}

module.exports = {
  init,
  logger,
  mailProxy
}