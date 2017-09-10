const loginRoutes = require("./routes/login-routes");
const registrationRoutes = require("./routes/registration-routes");

function init(app) {
  console.log("Registering Routes")
  loginRoutes.registerAuthRoutes(app);
  registrationRoutes.registerRegistrationRoutes(app);
}

module.exports = {
  init
}