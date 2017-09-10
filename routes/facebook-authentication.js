"use strict";

const express = require("express");
const passport = require("passport");

const router = express.Router();

const redirectOptions = {
    successRedirect: '/',
    failureRedirect: '/login'
};

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', redirectOptions));

module.exports = router;