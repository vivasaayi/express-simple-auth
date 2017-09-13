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

describe("User Service - Validations", function () {
  it("createUser - should validate the all the details", function (done) {
    userService.createUser({})
      .then(() => {
        expect("Not to be Called").toBe("But Called");
      })
      .catch((err) => {
        expect(err.errorCode).toBe("VALIDATION_FAILED");
        expect(err.errorMessages.length).toBe(3);

        expect(err.errorMessages[0]).toBe("DisplayName is Mandatory");
        expect(err.errorMessages[1]).toBe("Email is Mandatory");
        expect(err.errorMessages[2]).toBe("Please enter the Password and Confirm the same");

        done();
      });
  });

  it("createUser - should validate the DisplayName", function (done) {
    const user = {
      displayName: "",
      email: "sample@sample.com",
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
      confirmPassword: "password"
    };

    userService.createUser(user)
      .then(() => {
        expect("Not to be Called").toBe("But Called");
      })
      .catch((err) => {
        expect(err.errorCode).toBe("VALIDATION_FAILED");
        expect(err.errorMessages.length).toBe(1);

        expect(err.errorMessages[0]).toBe("DisplayName is Mandatory");

        done();
      });
  });

  it("createUser - should validate the email", function (done) {
    const user = {
      displayName: "Sample",
      email: "",
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
      confirmPassword: "password"
    };

    userService.createUser(user)
      .then(() => {
        expect("Not to be Called").toBe("But Called");
      })
      .catch((err) => {
        expect(err.errorCode).toBe("VALIDATION_FAILED");
        expect(err.errorMessages.length).toBe(1);

        expect(err.errorMessages[0]).toBe("Email is Mandatory");

        done();
      });
  });

  it("createUser - should validate the passwords if password is empty", function (done) {
    const user = {
      displayName: "Sample",
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
      password: "",
      confirmPassword: "password"
    };

    userService.createUser(user)
      .then(() => {
        expect("Not to be Called").toBe("But Called");
      })
      .catch((err) => {
        expect(err.errorCode).toBe("VALIDATION_FAILED");
        expect(err.errorMessages.length).toBe(2);

        expect(err.errorMessages[0]).toBe("Please enter the Password and Confirm the same");
        expect(err.errorMessages[1]).toBe("Passwords do not match");

        done();
      });
  });

  it("createUser - should validate the passwords if confirmPassword is empty", function (done) {
    const user = {
      displayName: "Sample",
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
      confirmPassword: ""
    };

    userService.createUser(user)
      .then(() => {
        expect("Not to be Called").toBe("But Called");
      })
      .catch((err) => {
        expect(err.errorCode).toBe("VALIDATION_FAILED");
        expect(err.errorMessages.length).toBe(2);

        expect(err.errorMessages[0]).toBe("Please enter the Password and Confirm the same");
        expect(err.errorMessages[1]).toBe("Passwords do not match");

        done();
      });
  });

  it("createUser - should validate the passwords if password and confirmPassword do not match", function (done) {
    const user = {
      displayName: "Sample",
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
      confirmPassword: "Another Password"
    };

    userService.createUser(user)
      .then(() => {
        expect("Not to be Called").toBe("But Called");
      })
      .catch((err) => {
        expect(err.errorCode).toBe("VALIDATION_FAILED");
        expect(err.errorMessages.length).toBe(1);

        expect(err.errorMessages[0]).toBe("Passwords do not match");

        done();
      });
  });

  it("createUser - validation should pass if all fields are present", function () {
    const user = {
      displayName: "Sample",
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
      confirmPassword: "password"
    };

    const result = userService.validateUserInfo(user);
    expect(result.length).toBe(0);
  });
});
