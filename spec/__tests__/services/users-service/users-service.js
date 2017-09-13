const _ = require("underscore");

const userService = require("../../../../src/services/users-service");
const specUtils = require("../../../utils/spec-utils");

const userToCreate = {
  displayName: "my_user_name_q",
  email: "my_email_q",
  firstName: "my_first_name_q",
  lastName: "my_last_name_q",
  password: "my_password_q",
  confirmPassword: "my_password_q"
};

describe("User Service", function () {
  beforeAll(function (done) {
    specUtils.emptyTables()
      .then(() => {
        console.log("Collections Emptied");
        done();
      })
      .catch((err) => {
        console.log("Error in Emptying the collections:", err);
        done();
      });
  });

  it("checkUserAlreadyExists - should return false if user not found", function (done) {
    userService.checkUserAlereadyExists(userToCreate.email)
      .then((result) => {
        expect(result).toBe(false);
        done();
      });
  });

  it("createUser - should succeed if all the fields are present and valid", function (done) {
    userService.createUser(userToCreate)
      .then((result) => {
        console.log("User Created Successfully:", result);
        return userService.checkUserAlereadyExists(userToCreate.email);
      })
      .then((result) => {
        expect(result).toBeTruthy();
        done();
      })
      .catch((err) => {
        console.log(err);
        expect("Not to be Called").toBe("But Called");
      });
  });

  it("checkUserAlereadyExists - should return true if user is found", function (done) {
    userService.checkUserAlereadyExists(userToCreate.email)
      .then((result) => {
        expect(result).toBe(true);
        done();
      });
  });

  it("createUser - should fail if user already exists", function (done) {
    userService.createUser(userToCreate)
      .then((result) => {
        console.log(result);
        expect("Not to be Called").toBe("But Called");
      })
      .catch((err) => {
        expect(err.code).toBe("USER_ALREADY_EXISTS");
        expect(err.message).toBe("An user with the same username/email already exists.");
        done();
      });
  });
});
