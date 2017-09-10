"use strict";

const express = require("express");
const passport = require("passport");

const router = express.Router();

const redirectOptions = {
    successRedirect: '/',
    failureRedirect: '/login'
};

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', redirectOptions));

module.exports = router;