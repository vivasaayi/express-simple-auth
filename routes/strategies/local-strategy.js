const LocalStrategy = require("passport-local").Strategy;

const authenticationController = require("../../../controllers/authentication-controller");

const localStrategy = new LocalStrategy(function (username, password, done) {
    authenticationController.doLogin(username, password)
        .then(result => {
            console.log("LOCAL_STRATEGY: Authenticaiton Succeeded", result)
            return done(null, { name: "Rajan" });
        })
        .catch(err => {
            console.log("LOCAL_STRATEGY: Authenticaiton Failed", err);
            return done(err, null);
        })
});

module.exports = localStrategy;