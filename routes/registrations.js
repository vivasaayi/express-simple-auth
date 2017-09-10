const registrationController = require("../controllers/registration-controller");

function registerRegistrationRoutes(app, router) {
  router.get("/registration/activation/:id", registrationController.activateUser);
  router.get("/register", registrationController.getRegistrationPage);
  router.post("/register", registrationController.registerUser);

  app.use(router);
}

module.exports = {
  registerAuthRoutes
};
