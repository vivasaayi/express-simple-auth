const registrationController = require("../controllers/registration-controller");

function registerRegistrationRoutes(router) {
  router.get("/registration/activation/:id", registrationController.activateUser);
  router.get("/register", registrationController.getRegistrationPage);
  router.post("/register", registrationController.registerUser);
}

module.exports = {
  registerRegistrationRoutes
};
