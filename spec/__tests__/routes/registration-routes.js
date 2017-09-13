const indexFile = require("../../../index");

const Router = require("../../utils/mocks/router-mock");
const App = require("../../utils/mocks/app-mock");

const Request = require("../../utils/mocks/request-mock");
const Response = require("../../utils/mocks/response-mock");

const router = new Router();
const app = new App();

indexFile.init(app, router);

describe("express-simple-auth", () => {
  it("Calling Get Registration endpoint, should render the registration page", () => {
    const getRegistrationHandler = router.getObject("GET", "/register");

    const req = new Request();
    const res = new Response();

    getRegistrationHandler.fn1(req, res)

    expect(res.renderCalls.length).toBe(1);

    const args = res.renderCalls[0];

    expect(args[0]).toEqual("register");
    expect(args[1]).toEqual({ hideMenus: true });
  });

  it("Calling POST Registration endpoint, should throw error if input data is not present", (done) => {
    const postRegistrationHandler = router.getObject("POST", "/register");

    function cb(args) {
      console.log("Completed", args);

      const firstArgument = args[0];
      expect(firstArgument[0]).toBe("register");
      expect(firstArgument[1].errorCode).toBe("UNABLE_TO_PARSE_USER_INFO");
      expect(firstArgument[1].errorMessages).not.toBeDefined();
      
      done();
    }

    const req = new Request();
    const res = new Response(cb);

    postRegistrationHandler.fn1(req, res)
  });

  it("Calling POST Registration endpoint, should throw error if user.displayname is empty", (done) => {
    const postRegistrationHandler = router.getObject("POST", "/register");

    function cb(args) {
      console.log("Completed", args);

      const firstArgument = args[0];
      expect(firstArgument[0]).toBe("register");
      expect(firstArgument[1].errorCode).toBe("VALIDATION_FAILED");
      expect(firstArgument[1].errorMessages.length).toBe(3);

      const errorMessages = firstArgument[1].errorMessages;

      expect(errorMessages[0]).toBe("DisplayName is Mandatory");
      expect(errorMessages[1]).toBe("Email is Mandatory");
      expect(errorMessages[2]).toBe("Please enter the Password and Confirm the same");
      
      done();
    }

    const req = new Request();
    const res = new Response(cb);

    req.fields = {};

    postRegistrationHandler.fn1(req, res)
  });
});