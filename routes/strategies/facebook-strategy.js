const FacebookStrategy = require("passport-facebook");
const facebookConfig = require("./auth-config").facebook;

const faceBookStrategy = new FacebookStrategy(facebookConfig, function (accessToken, refreshToken, profile, cb) {
    console.log("AccessToken:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("Profile:", profile);

    return cb(null, profile);

    //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //return cb(err, user);
    //});
});

module.exports = faceBookStrategy;