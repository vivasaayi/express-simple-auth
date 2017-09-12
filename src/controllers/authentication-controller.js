const authenticationService = require("../services/authentication-service");

class AuthenticationController {
    doLogin(userName, password) {
        return authenticationService.validateLogin(userName, password);
    }
}

module.exports = new AuthenticationController();