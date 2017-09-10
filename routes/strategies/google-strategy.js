const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const googleConfig = require("./auth-config").google;

const googleStrategy = new GoogleStrategy(googleConfig, function (accessToken, refreshToken, profile, cb) {
    console.log("AccessToken:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("Profile:", profile);

    cb(null, profile);

    //User.findByOpenID({ openId: identifier }, function (err, user) {
    //return done(err, user);
    //});
});

module.exports = googleStrategy;