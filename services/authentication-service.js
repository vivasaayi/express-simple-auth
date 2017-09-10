const Promise = require("bluebird");

const userDataRepository = require("../repositories/user-data-repository");

class AuthenticationService {
    validateLogin(userName, password) {
        console.log("userName:", userName);
        console.log("password:", password);
        
        return new Promise((resolve, reject) => {
            userDataRepository.customQueryV1("users", {}, function (err, results) {
                if (err) {
                    console.log("ERROR FETCHIGN USER:", err);
                    return reject(err);
                }

                console.log("USER FOUND:", results);
                return resolve(results);
            });
        });
    }
}

module.exports = new AuthenticationService();