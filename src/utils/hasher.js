const bcrypt = require("bcrypt");

const logger = require("../utils/logger");

const saltRounds = 9;

class Hasher {
  hash(plainText) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plainText, saltRounds, (err, hash) => {
        if (err) {
          logger.log("Error Creating the Hash");
          return reject(err);
        }

        return resolve(hash);
      });
    });
  }

  compare(plainText, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hash, (err, res) => {
        if (err) {
          logger.log("Error Comparing the Hash");
          return reject(err);
        }

        if (res === true) {
          return resolve(true);
        }

        return reject("Passwords doesnt match");
      });
    });
  }
}

module.exports = new Hasher();
