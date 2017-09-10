"use strict";

const express = require("express");
const passport = require("passport");

const router = express.Router();

const logger = require("../../utils/logger");


router.get("/login", (req, res) => {
//   logger.log("Login Requested", req.user);
  const flashMessage = req.flash("error");
  const infoMessage = req.flash("info");

  res.render("login", { hideMenus: true, flashMessage, infoMessage });
});

router.get("/logout", (req, res) => {
//   logger.log("Logout Requested", req.user);

  req.logout();
  res.redirect("/");
});

function logFields(req, res, next) {
  req.query = req.fields;
  logger.log(req.query);
  next();
}

const redirectOptions = {
  failureRedirect: "/login",
  failureFlash: "Either User doesn't exists or the password is not correct."
};

router.post("/login", logFields, passport.authenticate("local", redirectOptions), (req, res) => {
  res.redirect("/");
});

module.exports = router;


module.exports = router;