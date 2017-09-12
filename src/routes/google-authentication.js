"use strict";

const passport = require("passport");

const redirectOptions = {
    successRedirect: '/',
    failureRedirect: '/login'
};

function registerGoogleAuth(router) {
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

    router.get('/auth/google/callback', passport.authenticate('google', redirectOptions));
}


module.exports = {
    registerGoogleAuth
};