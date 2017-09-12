"use strict";

const passport = require("passport");

const logger = require("../utils/logger");

function getLoginPage(req, res) {
  //   logger.log("Login Requested", req.user);
  const flashMessage = req.flash("error");
  const infoMessage = req.flash("info");

  res.render("login", { hideMenus: true, flashMessage, infoMessage });
};

function getLogoutPage(req, res) {
  req.logout();
  res.redirect("/");
};

function registerLocalAuthRoutes(app) {
  router.get("/login", getLoginPage);
  router.get("/logout", getLogoutPage);

  router.post("/login", logFields, passport.authenticate("local", redirectOptions), (req, res) => {
    res.redirect("/");
  });
};


function logFields(req, res, next) {
  req.query = req.fields;
  logger.log(req.query);
  next();
}

const redirectOptions = {
  failureRedirect: "/login",
  failureFlash: "Either User doesn't exists or the password is not correct."
};

module.exports = {
  registerLocalAuthRoutes
};
