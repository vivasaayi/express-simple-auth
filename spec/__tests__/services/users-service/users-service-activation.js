const _ = require("underscore");

const userService = require("../../../../src/services/users-service");
const specUtils = require("../../../utils/spec-utils");

const userToCreate = {
  displayName: "my_user_name_q",
  email: "my_email_123",
  firstName: "my_first_name_q",
  lastName: "my_last_name_q",
  password: "my_password_q",
  confirmPassword: "my_password_q"
};

describe("User Service - Activations", function () {
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

  it("createUser - should insert new activation links for the user", function (done) {
    userService.createUser(userToCreate)
      .then((result) => {
        console.log("User Created Successfully:", result);
        return userService.getActivationLinksForUser(userToCreate.email);
      })
      .then((result) => {
        expect(result.length).toBe(1);

        expect(result[0].email).toBe(userToCreate.email);
        expect(result[0]._id).toBeDefined();
        expect(result[0]._id.length).toBe(36);
        expect(result[0].expired).toBe(false);
        done();
      })
      .catch((err) => {
        console.log(err);
        expect("Not to be Called").toBe("But Called");
      });
  });

  it("persistActivationId - one preexisting link, should expire existing activation ids", function (done) {
    console.log("Saving another Activation Id - 1");
    userService.persistActivationId(userToCreate.email, "5e271597-1111-2222-3333-4d5290e37f27")
      .then((result) => {
        console.log("Activation Id Persisted:", result);
        return userService.getActivationLinksForUser(userToCreate.email);
      })
      .then((results) => {
        expect(results.length).toBe(2);

        const currentLinks = [];
        const allLinksExceptCurrentLinks = [];

        _.each(results, (result) => {
          if (result._id === "5e271597-1111-2222-3333-4d5290e37f27") {
            currentLinks.push(result);
          } else {
            allLinksExceptCurrentLinks.push(result);
          }
        });

        expect(currentLinks.length).toBe(1);
        expect(allLinksExceptCurrentLinks.length).toBe(1);

        console.log(currentLinks);

        expect(currentLinks[0].expired).toBe(false);
        expect(allLinksExceptCurrentLinks[0].expired).toBeTruthy();

        done();
      })
      .catch((err) => {
        console.log(err);
        expect("Not to be Called").toBe("But Called");
      });
  });

  it("persistActivationId - two pre-existing link, should expire existing activation ids", function (done) {
    console.log("Saving another Activation Id - 2");
    userService.persistActivationId(userToCreate.email, "5e271597-4444-5555-6666-4d5290e37f27")
      .then((result) => {
        console.log("Activation Id Persisted:", result);
        return userService.getActivationLinksForUser(userToCreate.email);
      })
      .then((results) => {
        expect(results.length).toBe(3);

        const currentLinks = [];
        const allLinksExceptCurrentLinks = [];
        let previousLink;

        _.each(results, (result) => {
          if (result._id === "5e271597-4444-5555-6666-4d5290e37f27") {
            currentLinks.push(result);
          } else if (result._id === "5e271597-1111-2222-3333-4d5290e37f27") {
            previousLink = result;
            allLinksExceptCurrentLinks.push(result);
          } else {
            allLinksExceptCurrentLinks.push(result);
          }
        });

        expect(currentLinks.length).toBe(1);
        expect(allLinksExceptCurrentLinks.length).toBe(2);

        expect(currentLinks[0].expired).toBe(false);
        expect(allLinksExceptCurrentLinks[0].expired).toBeTruthy();
        expect(allLinksExceptCurrentLinks[1].expired).toBeTruthy();

        expect(allLinksExceptCurrentLinks[0].email).toBe(userToCreate.email);
        expect(allLinksExceptCurrentLinks[1].email).toBe(userToCreate.email);

        expect(previousLink.email).toBe(userToCreate.email);

        done();
      })
      .catch((err) => {
        console.log(err);
        expect("Not to be Called").toBe("But Called");
      });
  });
});
