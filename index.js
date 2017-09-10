const loginRoutes = require("./routes/login-routes");
const registrationRoutes = require("./routes/registration-routes");

const logger = require("./utils/logger");

function init(app) {
  logger.log("Registering Routes");

  loginRoutes.registerAuthRoutes(app);
  registrationRoutes.registerRegistrationRoutes(app);
}

module.exports = {
  init
}