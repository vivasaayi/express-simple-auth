const userService = require("../services/users-service");
const logger = require("../utils/logger");

class RegistrationController {
  activateUser(req, res) {
    const activationId = req.params.id;

    logger.log("Activating User Accout", activationId);

    userService.activateUserAccount(activationId)
      .then((result) => {
        logger.log("Activation Completed");

        req.flash("info", "Registration Completed. Now you can Login!");
        res.redirect("/login");
      })
      .catch((err) => {
        logger.log("Activation Failed failed", err);

        if (err.message === "Seems the link is expired") {
          req.flash("error", "Your activation link expired! Please request a new one.");
        } else {
          req.flash("error", "An unknown error occured during Activation. Please contact the admin!");
        }

        res.redirect("/login");
      });
  }

  getRegistrationPage(req, res) {
    res.render("register", { hideMenus: true });
  };

  registerUser(req, res) {
    logger.log("Registering User", req.fields);

    userService.createUser(req.fields)
      .then((result) => {
        logger.log("registration successfull", result);
        res.render("registration-successfull", { hideMenus: true });
      })
      .catch((err) => {
        logger.log("registration failed", err);

        res.render("register", { hideMenus: true, errorCode: err.errorCode, errorMessages: err.errorMessages });
      });
  }
}

module.exports = new RegistrationController();