"use strict";

const passport = require("passport");

const redirectOptions = {
    successRedirect: '/',
    failureRedirect: '/login'
};

function registerFacebookAuth(router) {
    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', redirectOptions));
}

module.exports = {
    registerFacebookAuth
};