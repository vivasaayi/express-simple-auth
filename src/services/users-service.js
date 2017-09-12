const Promise = require("bluebird");
const uuidV4 = require("uuid/v4");
const _ = require("underscore");

const usersRepository = require("../repositories/users-repository");
const logger = require("../utils/logger");
const mailerProxy = require("../proxies/mail-proxy");
const hasher = require("../utils/hasher");

const USER_ALREADY_EXISTS_MESSAGE = "An user with the same username/email already exists.";
const LOGIN_FAILED_MESSAGE = "Login Failed. User doesnt exist or passwords doesnt match";

class UsersService {
  checkUserAlereadyExists(email, displayName) {
    return usersRepository.getUsersByEmailOrName(email, displayName)
      .then((results) => {
        if (results.length <= 0) {
          logger.info("UsersService:checkUserAlereadyExists:", "False", results);
          return Promise.resolve(false);
        }

        logger.info("UsersService:checkUserAlereadyExists:", "true", results);
        return Promise.resolve(true);
      });
  }

  validateLogin(userName, password) {
    return usersRepository.getUsersByEmailOrName(userName, userName, true)
      .then((results) => {
        if (results.length <= 0) {
          logger.info("UsersService:validateLogin:", "User Not Found", results);
          return Promise.reject(LOGIN_FAILED_MESSAGE);
        }

        logger.info("UsersService:validateLogin:", "Login succeeded", results[0]);
        const user = results[0];

        return hasher.compare(password, user.password)
          .then((result) => {
            return user;
          });
      });
  }

  extractNewUserInfo(params) {
    const user = {
      displayName: params.displayName,
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: params.password,
      confirmPassword: params.confirmPassword
    };

    return user;
  }

  getShortProfile(userId) {
    let profile = {};

    return usersRepository.getUserById(userId)
      .then((user) => {
        logger.log("USER:", user);
        profile = user;

        return usersRepository.getProfileSummary(userId);
      })
      .then((summary) => {
        _.each(summary.posts, (record) => {
          if (record.type === "FREE") {
            profile.totalFreeDeals = record.count;
          } else if (record.type === "TRADE") {
            profile.totalTradeDeals = record.count;
          }
        });

        profile.freeSuccess = 0;
        profile.freeFailed = 0;

        _.each(summary.ratings, (record) => {
          if (record.type === "FREE" && record.redeemSuccess) {
            profile.freeSuccess = Number(record.count);
          } else if (record.type === "FREE" && !record.redeemSuccess) {
            profile.freeFailed = Number(record.count);
          } else if (record.type === "TRADE" && record.redeemSuccess) {
            profile.tradeSuccess = Number(record.count);
          } else if (record.type === "TRADE" && !record.redeemSuccess) {
            profile.tradeFailed = Number(record.count);
          }
        });

        profile.totalFreeClaimed = profile.freeSuccess + profile.freeFailed;

        profile.totalDeals = profile.totalFreeDeals + profile.totalTradeDeals;

        return Promise.resolve(profile);
      });
  }

  activateUserAccount(activationId) {
    logger.log("Activation Id", activationId);
    let email = "";

    return usersRepository.getActivationLinksForUser(activationId)
      .then((results) => {
        if (results.length <= 0) {
          throw new Error("Seems the link is expired");
        }

        const activationRecord = results[0];
        activationRecord.expired = true;

        email = activationRecord.email;

        return usersRepository.expireActivationLinks(email);
      })
      .then(() => {
        logger.log("Activating user corresponding user");
        return usersRepository.activateUser(email);
      })
      .then((result) => {
        logger.log("User created successfully");
        return result;
      });
  }

  validateUserInfo(user) {
    const validationMessages = [];

    if (!user.displayName) {
      validationMessages.push("DisplayName is Mandatory");
    }

    if (!user.email) {
      validationMessages.push("Email is Mandatory");
    }

    if (!user.password || !user.confirmPassword) {
      validationMessages.push("Please enter the Password and Confirm the same");
    }

    if (user.password !== user.confirmPassword) {
      validationMessages.push("Passwords do not match");
    }

    delete user.confirmPassword;

    return validationMessages;
  }

  sendActivationLink(user, activationId) {
    const link = "http://www.swapcents.com/registration/activation/" + activationId;
    const text = "Please find the activation link for swapcents: " + link;

    const htmlText = "<p>Please find the activation link for swapcents:</p><br/> " +
      "<a href='" + link + "'>" + link + "</a>";

    mailerProxy.send(user.email, "SwapCents - Activation Link", text, htmlText);
  }

  getActivationId() {
    const activationId = uuidV4();
    return activationId;
  }

  getActivationLinksForUser(email, fetchAllLinks) {
    return usersRepository.getActivationLinksForUser(email, fetchAllLinks)
      .then(results => results);
  }

  expireExistingActivationIds(email) {
    return this.getActivationLinksForUser(email)
      .then((results) => {
        const promises = [];

        _.each(results, (result) => {
          result.expired = true;
          promises.push(usersRepository.saveActivationId(result));
        });


        return Promise.all(promises);
      });
  }

  persistActivationId(email, activationId) {
    return usersRepository.expireActivationLinks(email)
      .then((result) => {
        const record = {
          email,
          activationId
        };

        return usersRepository.saveActivationId(record);
      });
  }

  hashPasswordAndSave(user) {
    return hasher.hash(user.password)
      .then((hash) => {
        user.password = hash;
        return usersRepository.createUser(user);
      });
  }

  createUser(params) {
    const locationInfo = "UsersService:CreateUser:";

    if (!params) {
      const result = {
        code: "UNABLE TO PARSE USER INFO"
      };

      logger.error(locationInfo, result);

      return Promise.reject(result);
    }

    const user = this.extractNewUserInfo(params);

    const validationResult = this.validateUserInfo(user);

    if (validationResult.length > 0) {
      const result = {
        code: "VALIDATION FAILED",
        messages: validationResult,
      };

      logger.error(locationInfo, result);

      return Promise.reject(result);
    }

    logger.info(locationInfo, "Validation Completed", user);

    const registrationStatus = {
      status: "Not Started"
    };

    return this.checkUserAlereadyExists(user.email, user.displayName)
      .then((userExists) => {
        if (!userExists) {
          logger.info(locationInfo, "User not exists. Creating New.", user);
          registrationStatus.status = "Creating User";
          return this.hashPasswordAndSave(user);
        }

        const error = {
          code: "USER_ALREADY_EXISTS",
          message: USER_ALREADY_EXISTS_MESSAGE
        };

        logger.error(locationInfo, error);

        registrationStatus.status = "Failed";
        registrationStatus.error = error;

        return Promise.reject(error);
      })
      .then((result) => {
        registrationStatus.status = "User Created";
        registrationStatus.user = result;

        const activationId = this.getActivationId();
        registrationStatus.activationId = activationId;

        return this.persistActivationId(registrationStatus.user.email, activationId);
      })
      .then((activationLinkRecord) => {
        // Send Asynchronously
        logger.info(locationInfo, "Activation Link", registrationStatus.activationId);
        return this.sendActivationLink(user, registrationStatus.activationId);
      })
      .then(() => {
        registrationStatus.status = "Completed";
        return registrationStatus.user;
      });
  }

  deleteUser(email) {
    logger.log("About to delete user");
    return usersRepository.deleteUser(email)
      .then((result) => {
        logger.log("User deleted successfully");
        return result;
      });
  }
}

module.exports = new UsersService();
